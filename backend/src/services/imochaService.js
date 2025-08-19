const db = require('../config/database/db');
const logger = require('../config/logger');
// Using built-in fetch (available in Node.js 18+)

// iMocha API credentials
const IMOCHA_API_KEY = "JHuaeAvDQsGfJxlHYpeJwFOxySVrdm";
const IMOCHA_BASE_URL = "https://apiv3.imocha.io/v3";

class ImochaService {
  /**
   * Invite candidate to iMocha test
   */
  async inviteCandidate(inviteData) {
    const {
      inviteId,
      email,
      name,
      sendEmail,
      callbackURL,
      redirectURL,
      disableMandatoryFields,
      hideInstruction,
      ccEmail
    } = inviteData;

    const targetUrl = `${IMOCHA_BASE_URL}/tests/${inviteId}/invite`;

    try {
      const requestBody = {
        email,
        name,
        sendEmail,
        callbackURL,
        redirectURL,
        disableMandatoryFields,
        hideInstruction
      };

      // Add ccEmail if provided
      if (ccEmail) {
        requestBody.ccEmail = ccEmail;
      }

      const response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": IMOCHA_API_KEY,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.text();
        logger.error("Error response from iMocha:", errorData);
        throw new Error(`iMocha API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      logger.info('iMocha invite sent successfully:', { email, inviteId });
      
      return data;
    } catch (error) {
      logger.error('Error inviting candidate to iMocha:', error);
      throw error;
    }
  }

  /**
   * Update candidate recruitment phase
   */
  async updateCandidateRecruitmentPhase(candidateEmail, recruitmentPhase) {
    try {
      const query = `
        UPDATE candidate_info
        SET recruitment_phase = $1
        WHERE candidate_email = $2
        RETURNING *;
      `;
      const values = [recruitmentPhase, candidateEmail];

      const result = await db.query(query, values);

      if (result.rows.length === 0) {
        return null;
      }

      logger.info('Candidate recruitment phase updated successfully');
      return result.rows[0];
    } catch (error) {
      logger.error('Database error in updateCandidateRecruitmentPhase:', error);
      throw error;
    }
  }

  /**
   * Save recruitment rounds to database
   */
  async saveRounds(rounds) {
    try {
      let newRounds = [];
      let hasFitment = false;

      for (const round of rounds) {
        const { rrf_id, recruitment_rounds } = round;

        if (recruitment_rounds.toLowerCase() === "fitment round") {
          hasFitment = true; // Mark fitment round presence
          continue; // Skip adding it for now
        }

        // Check if the round already exists
        const checkQuery =
          "SELECT COUNT(*) FROM rrf_rounds WHERE rrf_id = $1 AND recruitment_rounds = $2";
        const { rows } = await db.query(checkQuery, [
          rrf_id,
          recruitment_rounds,
        ]);

        if (parseInt(rows[0].count) === 0) {
          newRounds.push(round);
        }
      }

      if (newRounds.length > 0) {
        // Get current rounds (excluding "Fitment Round") for order calculation
        const orderQuery = `
          SELECT recruitment_rounds, round_order 
          FROM rrf_rounds WHERE rrf_id = $1 
          AND LOWER(recruitment_rounds) != 'fitment round' 
          ORDER BY round_order ASC
        `;
        const orderResult = await db.query(orderQuery, [newRounds[0].rrf_id]);
        let currentMaxOrder = orderResult.rows.length; // Get the count of non-fitment rounds

        // Insert new rounds
        const insertQuery = `
          INSERT INTO rrf_rounds (rrf_id, recruitment_rounds, round_order) 
          VALUES ${newRounds
            .map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`)
            .join(", ")}
        `;

        const values = newRounds.flatMap((round) => {
          currentMaxOrder += 1; // Increment order number
          return [round.rrf_id, round.recruitment_rounds, currentMaxOrder];
        });

        await db.query(insertQuery, values);
      }

      // Ensure "Fitment Round" is always last
      if (hasFitment) {
        // Remove existing Fitment Round if present
        await db.query(
          "DELETE FROM rrf_rounds WHERE rrf_id = $1 AND LOWER(recruitment_rounds) = 'fitment round'",
          [rounds[0].rrf_id]
        );

        // Reinsert Fitment Round as the last round
        const finalOrderQuery =
          "SELECT COUNT(*) AS total FROM rrf_rounds WHERE rrf_id = $1";
        const finalOrderResult = await db.query(finalOrderQuery, [
          rounds[0].rrf_id,
        ]);
        const lastOrder = parseInt(finalOrderResult.rows[0].total) + 1; // Next available order

        await db.query(
          "INSERT INTO rrf_rounds (rrf_id, recruitment_rounds, round_order) VALUES ($1, $2, $3)",
          [rounds[0].rrf_id, "Fitment Round", lastOrder]
        );
      }

      logger.info('Recruitment rounds saved successfully');
      return true;
    } catch (error) {
      logger.error('Database error in saveRounds:', error);
      throw error;
    }
  }

  /**
   * Get recruitment rounds by RRF ID
   */
  async getRounds(rrfId) {
    try {
      const query =
        "SELECT recruitment_rounds, round_order FROM rrf_rounds WHERE rrf_id = $1 ORDER BY round_order";
      const { rows } = await db.query(query, [rrfId]);

      logger.info('Recruitment rounds fetched successfully:', { count: rows.length });
      return rows;
    } catch (error) {
      logger.error('Database error in getRounds:', error);
      throw error;
    }
  }

  /**
   * Get next round for candidate
   */
  async getNextRound(rrfId, recruitmentPhase) {
    try {
      // If candidate is "Shortlisted in L2", treat it as "L2 Technical" completed
      const currentPhase =
        recruitmentPhase === "Shortlisted in L2"
          ? "L2 Technical"
          : recruitmentPhase === "Shortlisted in EC Fitment Round"
          ? "EC Fitment"
          : recruitmentPhase === "Shortlisted in Project Fitment Round"
          ? "Project Fitment"
          : recruitmentPhase === "Shortlisted in Client Fitment Round"
          ? "Client Fitment"
          : recruitmentPhase === "Shortlisted in Client"
          ? "Client"
          : recruitmentPhase;

      // Fetch all rounds for the given rrf_id ordered by round_order
      const roundsQuery = `
        SELECT recruitment_rounds, round_order
        FROM rrf_rounds
        WHERE rrf_id = $1
        ORDER BY round_order ASC
      `;

      const roundsResult = await db.query(roundsQuery, [rrfId]);
      const rounds = roundsResult.rows;

      if (rounds.length === 0) {
        return null;
      }

      // Find the index of the current round
      const currentRoundIndex = rounds.findIndex(
        (round) => round.recruitment_rounds === currentPhase
      );

      // If there's a next round, return it
      if (currentRoundIndex !== -1 && currentRoundIndex + 1 < rounds.length) {
        return rounds[currentRoundIndex + 1].recruitment_rounds;
      }

      return null; // No next round found
    } catch (error) {
      logger.error('Database error in getNextRound:', error);
      throw error;
    }
  }

  /**
   * Get feedback form data
   */
  async getFeedbackForm(candidateEmail, roundDetails) {
    try {
      const query = `
        SELECT * FROM feedbackform
        WHERE candidate_email = $1 AND round_details = $2;
      `;

      const result = await db.query(query, [candidateEmail, roundDetails]);

      if (result.rows.length > 0) {
        return result.rows[0];
      }

      return null;
    } catch (error) {
      logger.error('Database error in getFeedbackForm:', error);
      throw error;
    }
  }

  /**
   * Get candidate data by email
   */
  async getCandidateData(candidateEmail) {
    try {
      const query = `
        SELECT candidate_name, candidate_email, role, rrf_id, hr_email
        FROM candidate_info
        WHERE candidate_email = $1;
      `;

      const result = await db.query(query, [candidateEmail]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      logger.error('Database error in getCandidateData:', error);
      throw error;
    }
  }

  /**
   * Get role to invite ID mapping
   */
  getRoleToInviteIdMap() {
    return {
      "Junior Azure DevOps Engineer": 1292765,
      "Senior Azure DevOps Engineer": 1292976,
      "Junior AWS DevOps Engineer": 1292733,
      "Senior AWS DevOps Engineer": 1292950,
      "Junior Azure Platform Engineer": 1292775,
      "Junior AWS Platform Engineer": 1292769,
      "Senior AWS Platform Engineer": 1292990,
      "Lead AWS Platform Engineer": 1295883,
      "Junior Azure Cloudops Engineer": 1292781,
      "Junior AWS Cloudops Engineer": 1292779,
      "AWS Data Engineer": 1303946,
      "Azure Data Engineer": 1293813,
      "Databricks Data Engineer": 1293971,
      "Hadoop Data Engineer": 1263132,
      "DataStage Data Engineer": 1304065,
      "IBM MDM Data Engineer": 1233151,
      "ETL Data Engineer": 1294495,
      "Oracle Data Engineer": 1302835,
      "IDMC Data Engineer": 1294495,
      "Marklogic Data Engineer": 1304066,
      "SQL Data Engineer": 1304100,
      "Snowflake Data Engineer": 1292173,
      "SSIS Data Engineer": 1293822,
      "Power BI Data – BI Visualization Engineer": 1303985,
      "Tableau Data – BI Visualization Engineer": 1303999,
      "WebFOCUS Data – BI Visualization Engineer": 1304109,
      "DataAnalyst": 1304111,
      "Data Modeller": 1304149,
      "Junior .Net Cloud Native Application Engineer - Backend": 1304441,
      "Senior .Net Cloud Native Application Engineer - Backend": 1228695,
      "Junior Java Cloud Native Application Engineer - Backend": 1302022,
      "Senior Java Cloud Native Application Engineer - Backend": 1228712,
      "Junior Angular Cloud Native Application Engineer - Frontend": 1228715,
      "Senior Angular Cloud Native Application Engineer - Frontend": 1228781,
      "Junior React Cloud Native Application Engineer - Frontend": 1288123,
      "Senior React Cloud Native Application Engineer - Frontend": 1228784,
      "Junior Java Angular Cloud Native Application Engineer - Full Stack": 1228718,
      "Senior Java Angular Cloud Native Application Engineer - Full Stack": 1228721,
      "Junior Java React Cloud Native Application Engineer - Full Stack": 1228724,
      "Senior Java React Cloud Native Application Engineer - Full Stack": 1228727,
      "Junior .Net Angular Cloud Native Application Engineer - Full Stack": 1228730,
      "Senior .Net Angular Cloud Native Application Engineer - Full Stack": 1228733,
      "Junior .Net React Cloud Native Application Engineer - Full Stack": 1228736,
      "Senior .Net React Cloud Native Application Engineer - Full Stack": 1228739,
      "Junior Mendix Cloud Native Application Engineer - Low Code": 1228742,
      "Senior Mendix Cloud Native Application Engineer - Low Code": 1228745
    };
  }
}

module.exports = ImochaService; 