import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
// import PptxGenJS from 'pptxgenjs';
// import html2canvas from 'html2canvas';
import './Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUsers, faTasks, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
    const [uploadCount, setUploadCount] = useState(0);
    const [shortlistedCount, setShortlistedCount] = useState(0);
    const [rejectedCount, setRejectedCount] = useState(0);
    const [inviteCount, setInviteCount] = useState('Loading...');
    const [availableScoreCount, setAvailableScoreCount] = useState('Loading...');
    const [devopsApplicants, setDevopsApplicants] = useState('Loading...');
    const [platformApplicants, setPlatformApplicants] = useState('Loading...');
    const [siteApplicants, setSiteApplicants] = useState('Loading...');
    const [cloudopsApplicants, setCloudopsApplicants] = useState('Loading...');
    const [dataEngineerApplicants, setDataEngineerApplicants] = useState('Loading...');
    const [biVisualizationApplicants, setBiVisualizationApplicants] = useState('Loading...');
    const [dataAnalystApplicants, setDataAnalystApplicants] = useState('Loading...');
    const [dataModellerApplicants, setDataModellerApplicants] = useState('Loading...');
    const [cloudNativeBackendApplicants, setCloudNativeBackendApplicants] = useState('Loading...');
    const [cloudNativeFrontendApplicants] = useState('Loading...');
    const [lcncPlatformEngineerApplicants] = useState('Loading...');
    const [integrationEngineerApplicants] = useState('Loading...');
    const [ecMapping, setEcMapping] = useState([]);
    const [showAppEC, setShowAppEC] = useState(false);
    
    useEffect(() => {
        const ecMappingParam = localStorage.getItem("ec_mapping");
        if (ecMappingParam) {
            const ecMappingArray = decodeURIComponent(ecMappingParam).split(",");
            setEcMapping(ecMappingArray);
            setShowAppEC(ecMappingArray.includes('App EC'));
        }
    }, []);
    const [tagData, setTagData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;

    const updateTableDisplay = (data, page) => {
        const startIndex = (page - 1) * recordsPerPage;
        const endIndex = startIndex + recordsPerPage;
        const paginatedData = data.slice(startIndex, endIndex);
        
        const tableBody = document.querySelector('#phaseTable tbody');
        if (tableBody) {
            tableBody.innerHTML = paginatedData.map(item => `
                <tr>
                    <td style="padding: 8px 12px; border-bottom: 1px solid #ddd;">${item.tagName}</td>
                    <td style="padding: 8px 12px; border-bottom: 1px solid #ddd;">${item.prescreening}</td>
                    <td style="padding: 8px 12px; border-bottom: 1px solid #ddd;">${item.technicalL1}</td>
                    <td style="padding: 8px 12px; border-bottom: 1px solid #ddd;">${item.technicalL2}</td>
                    <td style="padding: 8px 12px; border-bottom: 1px solid #ddd;">${item.ecFitment}</td>
                    <td style="padding: 8px 12px; border-bottom: 1px solid #ddd;">${item.projectFitment}</td>
                    <td style="padding: 8px 12px; border-bottom: 1px solid #ddd;">${item.clientInterview}</td>
                    <td style="padding: 8px 12px; border-bottom: 1px solid #ddd;">${item.shortlisted}</td>
                </tr>
            `).join('');
        }
        
        updatePaginationControls(data.length, page);
    };

    const updatePaginationControls = (totalRecords, currentPageNum) => {
        const totalPages = Math.ceil(totalRecords / recordsPerPage);
        const paginationDiv = document.querySelector('#paginationControls');
        
        if (paginationDiv && totalPages > 1) {
            paginationDiv.innerHTML = `
                <div class="dash-pagination">
                    <button>Previous</button>
                    <span>Page ${currentPageNum} of ${totalPages}</span>
                    <button>Next</button>
                </div>
            `;
            
            const buttons = paginationDiv.querySelectorAll('button');
            const prevBtn = buttons[0];
            const nextBtn = buttons[1];
            
            prevBtn.disabled = currentPageNum === 1;
            nextBtn.disabled = currentPageNum === totalPages;
            
            prevBtn.onclick = () => {
                if (currentPageNum > 1) handlePageChange(currentPageNum - 1);
            };
            
            nextBtn.onclick = () => {
                if (currentPageNum < totalPages) handlePageChange(currentPageNum + 1);
            };
        }
    };



    const handlePageChange = (page) => {
        if (page >= 1 && page <= Math.ceil(tagData.length / recordsPerPage)) {
            setCurrentPage(page);
        }
    };

    // Update table when currentPage or tagData changes
    useEffect(() => {
        if (tagData.length > 0) {
            updateTableDisplay(tagData, currentPage);
        }
    }, [currentPage, tagData]);

    const departmentChartRef = useRef(null);
    const departmentRoleChartRef = useRef(null);
    const statusChartRef = useRef(null);
    const roleChartRef = useRef(null);
    const newStatusChartRef = useRef(null);
    const newRoleChartRef = useRef(null);
    const secondStatusChartRef = useRef(null);
    const secondRoleChartRef = useRef(null);
    const hrChartRef = useRef(null);

    // Chart instance refs
    const departmentChart = useRef(null);
    const departmentRoleChart = useRef(null);
    const statusChart = useRef(null);
    const roleChart = useRef(null);
    const newStatusChart = useRef(null);
    const newRoleChart = useRef(null);
    const secondStatusChart = useRef(null);
    const secondRoleChart = useRef(null);
    const hrChart = useRef(null);


    useEffect(() => {
        // All the javascript from the original file will go here.
        // I'll break it down into smaller useEffects for clarity.




        
        const toggleSidebar = () => {
            const sidebar = document.getElementById("sidebar");
            sidebar.classList.toggle("show");
        }
        
        document.getElementById('toggle-sidebar-btn').addEventListener('click', toggleSidebar);


        const initializeCharts = () => {
            // EC Overview Chart
            if (departmentChartRef.current) {
                const existingChart = Chart.getChart(departmentChartRef.current);
                if (existingChart) existingChart.destroy();
                const departmentCtx = departmentChartRef.current.getContext('2d');
                departmentChart.current = new Chart(departmentCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Cloud', 'App', 'Data'],
                    datasets: [{
                        data: [],
                        backgroundColor: ['#FFB6C1', '#87CEEB', '#FFD700'],
                    }, ],
                },
                plugins: [ChartDataLabels],
                });
            }

            // Applicants per EC Chart
            if (departmentRoleChartRef.current) {
                const existingChart = Chart.getChart(departmentRoleChartRef.current);
                if (existingChart) existingChart.destroy();
                const departmentRoleCtx = departmentRoleChartRef.current.getContext('2d');
                departmentRoleChart.current = new Chart(departmentRoleCtx, {
                type: 'bar',
                data: {
                    labels: ['Cloud', 'App', 'Data'],
                    datasets: [{
                        data: [],
                        backgroundColor: ['#ADD8E6', '#FFA07A', '#90EE90'],
                    }, ],
                },
                options: {
                    plugins: {
                        legend: {
                            display: false,
                        },
                    },
                },
                plugins: [ChartDataLabels],
                });
            }
            
            // Status Chart
            if (statusChartRef.current) {
                const existingChart = Chart.getChart(statusChartRef.current);
                if (existingChart) existingChart.destroy();
                const statusCtx = statusChartRef.current.getContext("2d");
                statusChart.current = new Chart(statusCtx, {
                type: "doughnut",
                data: {
                    labels: ["Devops", "Platform", "Cloudops", "Migration"],
                    datasets: [{
                        data: [],
                        backgroundColor: ["#d7bde2", "#7fb3d5", "#76d7c4", "#f5cba7"],
                    }, ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: "right",
                            labels: {
                                color: "black",
                            },
                        },
                        datalabels: {
                            color: "black",
                            formatter: function(value, context) {
                                return value > 0 ? value : null;
                            },
                            anchor: "center",
                            align: "center",
                            font: {
                                size: 14,
                            },
                        },
                    },
                },
                plugins: [ChartDataLabels],
                });
            }
            
            // Role Chart
            if (roleChartRef.current) {
                const existingChart = Chart.getChart(roleChartRef.current);
                if (existingChart) existingChart.destroy();
                const roleCtx = roleChartRef.current.getContext("2d");
                roleChart.current = new Chart(roleCtx, {
                type: "bar",
                data: {
                    labels: ["DevOps", "Platform", "Migration", "Cloud Ops"],
                    datasets: [{
                        label: "Applications",
                        data: [0, 0, 0, 0],
                        backgroundColor: ["#d7bde2", "#7fb3d5", "#f5cba7", "#76d7c4"],
                    }, ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: "black",
                            },
                        },
                        x: {
                            ticks: {
                                color: "black",
                            },
                        },
                    },
                    plugins: {
                        legend: {
                            display: false,
                        },
                        datalabels: {
                            anchor: "center",
                            align: "center",
                            color: "black",
                            formatter: function(value, context) {
                                return value;
                            },
                            font: {
                                size: 12,
                            },
                        },
                    },
                },
                plugins: [ChartDataLabels],
                });
            }
            
            // New Status Chart
            if (newStatusChartRef.current) {
                const existingChart = Chart.getChart(newStatusChartRef.current);
                if (existingChart) existingChart.destroy();
                const newStatusCtx = newStatusChartRef.current.getContext("2d");
                newStatusChart.current = new Chart(newStatusCtx, {
                type: "doughnut",
                data: {
                    labels: [
                        " App Engineer - Front End",
                        " App Engineer - Backend",
                        "LCNC Platform Engineer",
                        "Integration Engineer",
                    ],
                    datasets: [{
                        data: [0, 0, 0, 0],
                        backgroundColor: ["#d7bde2", "#7fb3d5", "#f5cba7", "#76d7c4"],
                    }, ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: "right",
                            labels: {
                                color: "black",
                            },
                        },
                        datalabels: {
                            color: "black",
                            formatter: function(value) {
                                return value > 0 ? value : null;
                            },
                            anchor: "center",
                            align: "center",
                            font: {
                                size: 14,
                            },
                        },
                    },
                },
                plugins: [ChartDataLabels],
                });
            }
            
            // New Role Chart
            if (newRoleChartRef.current) {
                const existingChart = Chart.getChart(newRoleChartRef.current);
                if (existingChart) existingChart.destroy();
                const newRoleCtx = newRoleChartRef.current.getContext("2d");
                newRoleChart.current = new Chart(newRoleCtx, {
                type: "bar",
                data: {
                    labels: [
                        "App Engineer - Front End",
                        "App Engineer - Backend",
                        "LCNC Platform Engineer",
                        "Integration Engineer",
                    ],
                    datasets: [{
                        label: "Applicants",
                        data: [0, 0, 0, 0],
                        backgroundColor: ["#d7bde2", "#7fb3d5", "#f5cba7", "#76d7c4"],
                    }, ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: "black",
                            },
                        },
                        x: {
                            ticks: {
                                color: "black",
                            },
                        },
                    },
                    plugins: {
                        legend: {
                            display: false,
                        },
                        datalabels: {
                            anchor: "center",
                            align: "center",
                            color: "black",
                            formatter: function(value) {
                                return value;
                            },
                            font: {
                                size: 12,
                            },
                        },
                    },
                },
                plugins: [ChartDataLabels],
                });
            }
            
            // Second Status Chart
            if (secondStatusChartRef.current) {
                const existingChart = Chart.getChart(secondStatusChartRef.current);
                if (existingChart) existingChart.destroy();
                const secondStatusCtx = secondStatusChartRef.current.getContext("2d");
                secondStatusChart.current = new Chart(secondStatusCtx, {
                type: "doughnut",
                data: {
                    labels: [
                        "Data Engineer",
                        "Data-Ops Engineer",
                        "Data – BI Visualization Engineer",
                        "Data Modeller",
                        "Data Analyst",
                        "Data Architect",
                        "Data Scientist –AI/ML",
                    ],
                    datasets: [{
                        data: [0, 0, 0, 0, 0, 0, 0],
                        backgroundColor: [
                            "#d7bde2",
                            "#7fb3d5",
                            "#f5cba7",
                            "#76d7c4",
                            "#f9e79f",
                            "#95a5a6",
                            "#3498db",
                        ],
                    }, ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: "right",
                            labels: {
                                color: "black"
                            },
                        },
                        datalabels: {
                            color: "black",
                            formatter: (value) => (value > 0 ? value : null),
                            anchor: "center",
                            align: "center",
                            font: {
                                size: 14
                            },
                        },
                    },
                },
                plugins: [ChartDataLabels],
                });
            }
            
            // Second Role Chart
            if (secondRoleChartRef.current) {
                const existingChart = Chart.getChart(secondRoleChartRef.current);
                if (existingChart) existingChart.destroy();
                const secondRoleCtx = secondRoleChartRef.current.getContext("2d");
                secondRoleChart.current = new Chart(secondRoleCtx, {
                type: "bar",
                data: {
                    labels: [
                        "Data Engineer",
                        "Data-Ops Engineer",
                        "Data – BI Visualization Engineer",
                        "Data Modeller",
                        "Data Analyst",
                        "Data Architect",
                        "Data Scientist –AI/ML",
                    ],
                    datasets: [{
                        label: "Applications",
                        data: [0, 0, 0, 0, 0, 0, 0],
                        backgroundColor: [
                            "#d7bde2",
                            "#7fb3d5",
                            "#f5cba7",
                            "#76d7c4",
                            "#f9e79f",
                            "#95a5a6",
                            "#3498db",
                        ],
                    }, ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: "black"
                            },
                        },
                        x: {
                            ticks: {
                                color: "black"
                            },
                        },
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        datalabels: {
                            anchor: "center",
                            align: "center",
                            color: "black",
                            formatter: (value) => value,
                            font: {
                                size: 12
                            },
                        },
                    },
                },
                plugins: [ChartDataLabels],
                });
            }
            
            // HR Chart
            if (hrChartRef.current) {
                const existingChart = Chart.getChart(hrChartRef.current);
                if (existingChart) existingChart.destroy();
                const hrCtx = hrChartRef.current.getContext("2d");
                hrChart.current = new Chart(hrCtx, {
                 type: "bar",
      data: {
          labels: [
              "Prescreening",
              "Technical L1",
              "Technical L2",
              "EC Fitment",
              "Project Fitment",
              "Client Interview",
              "Shortlisted",
          ],
          datasets: [],
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
              legend: {
                  position: "top",
                  labels: {
                      boxWidth: 16,
                      padding: 20,
                      font: {
                          family: "'Segoe UI', Roboto, 'Helvetica Neue', Arial",
                          size: 12,
                          weight: '500'
                      },
                      usePointStyle: true,
                      pointStyle: 'circle'
                  },
                  onHover: function (event, legendItem, legend) {
                      const dataset = legend.chart.data.datasets[legendItem.datasetIndex];
                      if (dataset && dataset.fullLabel) {
                          const legendTooltip = document.getElementById('legendTooltip');
                          if (legendTooltip) {
                              legendTooltip.innerText = dataset.fullLabel;
                              legendTooltip.style.display = "block";
                              legendTooltip.style.left = event.native.clientX + 10 + "px";
                              legendTooltip.style.top = event.native.clientY + 10 + "px";
                          }
                      }
                      if (event.native && event.native.target) {
                          event.native.target.style.cursor = "pointer";
                      }
                  },
                  onLeave: function (event) {
                      const legendTooltip = document.getElementById('legendTooltip');
                      if (legendTooltip) {
                          legendTooltip.style.display = "none";
                      }
                      if (event.native && event.native.target) {
                          event.native.target.style.cursor = "default";
                      }
                  }
              },
              tooltip: {
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  titleFont: {
                      family: "'Segoe UI', Roboto, 'Helvetica Neue', Arial",
                      size: 12,
                      weight: 'bold'
                  },
                  bodyFont: {
                      family: "'Segoe UI', Roboto, 'Helvetica Neue', Arial",
                      size: 12
                  },
                  padding: 12,
                  cornerRadius: 4,
                  displayColors: true,
                  mode: 'index',
                  intersect: false,
                  callbacks: {
                      label: function (context) {
                          const dataset = context.dataset;
                          const fullLabel = dataset.fullLabel || dataset.label;
                          const value = context.raw;
                          return `${fullLabel}: ${value}`;
                      }
                  }
              }
          },
          scales: {
              x: {
                  stacked: true,
                  grid: {
                      display: false
                  },
                  ticks: {
                      font: {
                          family: "'Segoe UI', Roboto, 'Helvetica Neue', Arial",
                          size: 11,
                          weight: '500'
                      }
                  }
              },
              y: {
                  stacked: true,
                  beginAtZero: true,
                  ticks: {
                      font: {
                          family: "'Segoe UI', Roboto, 'Helvetica Neue', Arial",
                          size: 11
                      },
                      precision: 0
                  },
                  grid: {
                      color: 'rgba(0,0,0,0.05)'
                  }
              }
          },
          elements: {
              bar: {
                  borderRadius: 4,
                  borderWidth: 0,
                  borderSkipped: false
              }
          },
          animation: {
              duration: 800,
              easing: 'easeOutQuart'
          }
      }
                });
            }

        }

        // Add a small delay to ensure DOM is ready
        setTimeout(() => {
            initializeCharts();
            fetchAndUpdateCharts();
        }, 100);

        // Data fetching and chart updates
        const fetchAndUpdateCharts = async () => {
            
            const fetchTotalCountAndUpdateCharts = async (ecMapping) => {
                try {
                    const ecs = ecMapping.join(",");
                    const response = await fetch(
                        `https://demotag.vercel.app/api/candidate-total-by-team?ecs=${encodeURIComponent(ecs)}`
                    );
            
                    if (!response.ok) {
                        throw new Error("Failed to fetch data");
                    }
            
                    const data = await response.json();
            
                    const cloudCount = data["Cloud EC"] || 0;
                    const appCount = data["App EC"] || 0;
                    const dataCount = data["Data EC"] || 0;
            
                    if (departmentChart.current && departmentChart.current.data) {
                        departmentChart.current.data.datasets[0].data = [cloudCount, appCount, dataCount];
                        departmentChart.current.update();
                    }
            
                    if (departmentRoleChart.current && departmentRoleChart.current.data) {
                        departmentRoleChart.current.data.datasets[0].data = [cloudCount, appCount, dataCount];
                        departmentRoleChart.current.update();
                    }
                } catch (error) {
                    console.error("Error fetching total count by team:", error);
                }
            }

            const ecMappingParam = localStorage.getItem("ec_mapping");
            let ecMappingArray = [];
            if (ecMappingParam) {
                ecMappingArray = decodeURIComponent(ecMappingParam).split(",");
            }
            fetchTotalCountAndUpdateCharts(ecMappingArray);
            
            const updateNewChartData = (teamACount, teamBCount, teamCCount, teamDCount) => {
                if (newStatusChart.current && newStatusChart.current.data) {
                    newStatusChart.current.data.datasets[0].data = [
                        teamACount,
                        teamBCount,
                        teamCCount,
                        teamDCount,
                    ];
                    newStatusChart.current.update();
                }
            }

            const updateNewBarChartData = (teamACount, teamBCount, teamCCount, teamDCount) => {
                if (newRoleChart.current && newRoleChart.current.data) {
                    newRoleChart.current.data.datasets[0].data = [
                        teamACount,
                        teamBCount,
                        teamCCount,
                        teamDCount,
                    ];
                    newRoleChart.current.update();
                }
            }

            const fetchNewCountsAndUpdateChart = async () => {
                try {
                    const teamACount = await fetch("https://demotag.vercel.app/api/snow-resume-count").then((res) => res.json()).then((data) => data.count || 0);
                    const teamBCount = await fetch("https://demotag.vercel.app/api/reactjs-resume-count").then((res) => res.json()).then((data) => data.count || 0);
                    const teamCCount = await fetch("https://demotag.vercel.app/api/hadoop-resume-count").then((res) => res.json()).then((data) => data.count || 0);
                    const teamDCount = await fetch("https://demotag.vercel.app/api/java-resume-count").then((res) => res.json()).then((data) => data.count || 0);

                    updateNewChartData(teamACount, teamBCount, teamCCount, teamDCount);
                    updateNewBarChartData(teamACount, teamBCount, teamCCount, teamDCount);
                } catch (error) {
                    console.error("Error updating new chart data:", error);
                }
            }
            fetchNewCountsAndUpdateChart();
            
            const fetchNewCounts = async (apiEndpoint, label) => {
                try {
                    const response = await fetch(apiEndpoint);
                    if (!response.ok) throw new Error(`Failed to fetch ${label} data`);
                    const data = await response.json();
                    return data.count || 0;
                } catch (error) {
                    console.error(`Error fetching ${label} data:`, error);
                    return 0;
                }
            }
            
            const updateSecondCharts = (dataEngineerCount, dataOpsEngineerCount, dataBIVisualizationCount, dataModellerCount, dataAnalystCount, dataArchitectCount, dataScientistCount) => {
                if (secondStatusChart.current && secondStatusChart.current.data) {
                    secondStatusChart.current.data.datasets[0].data = [dataEngineerCount, dataOpsEngineerCount, dataBIVisualizationCount, dataModellerCount, dataAnalystCount, dataArchitectCount, dataScientistCount];
                    secondStatusChart.current.update();
                }
                if (secondRoleChart.current && secondRoleChart.current.data) {
                    secondRoleChart.current.data.datasets[0].data = [dataEngineerCount, dataOpsEngineerCount, dataBIVisualizationCount, dataModellerCount, dataAnalystCount, dataArchitectCount, dataScientistCount];
                    secondRoleChart.current.update();
                }
            }
            
            const updateSecondApplicantCountsHTML = (dataEngineerCount, dataOpsEngineerCount, dataBIVisualizationCount, dataModellerCount, dataAnalystCount, dataArchitectCount, dataScientistCount) => {
                setDataEngineerApplicants(`${dataEngineerCount} Applicants`);
                // document.getElementById("data-ops-engineer-applicants").innerText = `${dataOpsEngineerCount} Applicants`;
                setBiVisualizationApplicants(`${dataBIVisualizationCount} Applicants`);
                setDataModellerApplicants(`${dataModellerCount} Applicants`);
                setDataAnalystApplicants(`${dataAnalystCount} Applicants`);
                // document.getElementById("data-architect-applicants").innerText = `${dataArchitectCount} Applicants`;
                // document.getElementById("data-scientist-applicants").innerText = `${dataScientistCount} Applicants`;
            }

            const fetchAndUpdateSecondCharts = async () => {
                try {
                    const [
                        dataEngineerCount,
                        dataOpsEngineerCount,
                        dataBIVisualizationCount,
                        dataModellerCount,
                        dataAnalystCount,
                        dataArchitectCount,
                        dataScientistCount,
                    ] = await Promise.all([
                        fetchNewCounts("https://demotag.vercel.app/api/data-resume-count", "Data Engineer"),
                        fetchNewCounts("https://demotag.vercel.app/api/data-ops-resume-count", "Data-Ops Engineer"),
                        fetchNewCounts("https://demotag.vercel.app/api/data-bi-resume-count", "Data – BI Visualization Engineer"),
                        fetchNewCounts("https://demotag.vercel.app/api/data-modeller-resume-count", "Data Modeller"),
                        fetchNewCounts("https://demotag.vercel.app/api/data-analyst-resume-count", "Data Analyst"),
                        fetchNewCounts("https://demotag.vercel.app/api/data-architect-resume-count", "Data Architect"),
                        fetchNewCounts("https://demotag.vercel.app/api/data-scientist-resume-count", "Data Scientist – AI/ML"),
                    ]);

                    updateSecondCharts(
                        dataEngineerCount,
                        dataOpsEngineerCount,
                        dataBIVisualizationCount,
                        dataModellerCount,
                        dataAnalystCount,
                        dataArchitectCount,
                        dataScientistCount
                    );
                    updateSecondApplicantCountsHTML(
                        dataEngineerCount,
                        dataOpsEngineerCount,
                        dataBIVisualizationCount,
                        dataModellerCount,
                        dataAnalystCount,
                        dataArchitectCount,
                        dataScientistCount
                    );
                } catch (error) {
                    console.error("Error updating data for second charts:", error);
                }
            }
            fetchAndUpdateSecondCharts();

            const updateApplicantCounts = async () => {
                try {
                    const fetchDevOpsCount = async () => (await (await fetch("https://demotag.vercel.app/api/devops-resume-count")).json()).count || 0;
                    const fetchplatformCount = async () => (await (await fetch("https://demotag.vercel.app/api/platform-resume-count")).json()).count || 0;
                    const fetchcloudopsCount = async () => (await (await fetch("https://demotag.vercel.app/api/cloudops-resume-count")).json()).count || 0;
                    const fetchsiteCount = async () => (await (await fetch("https://demotag.vercel.app/api/site-resume-count")).json()).count || 0;
                    const fetchdataengineerCount = async () => (await (await fetch("https://demotag.vercel.app/api/data-resume-count")).json()).count || 0;
                    const fetchdatabiCount = async () => (await (await fetch("https://demotag.vercel.app/api/data-bi-resume-count")).json()).count || 0;
                    const fetchdatamodellerCount = async () => (await (await fetch("https://demotag.vercel.app/api/data-modeller-resume-count")).json()).count || 0;
                    const fetchdataanalystCount = async () => (await (await fetch("https://demotag.vercel.app/api/data-analyst-resume-count")).json()).count || 0;
                    const fetchbackendCount = async () => (await (await fetch("https://demotag.vercel.app/api/reactjs-resume-count")).json()).count || 0;

                    const devOpsCount = await fetchDevOpsCount();
                    const platformCount = await fetchplatformCount();
                    const cloudOpsCount = await fetchcloudopsCount();
                    const siteCount = await fetchsiteCount();
                    const dataEngineer = await fetchdataengineerCount();
                    const dataBIVisualizationCount = await fetchdatabiCount();
                    const dataAnalystCount = await fetchdataanalystCount();
                    const dataModellerCount = await fetchdatamodellerCount();
                    const backendCount = await fetchbackendCount();

                    setDevopsApplicants(`${devOpsCount} Applicants`);
                    setPlatformApplicants(`${platformCount} Applicants`);
                    setCloudopsApplicants(`${cloudOpsCount} Applicants`);
                    setSiteApplicants(`${siteCount} Applicants`);
                    setDataEngineerApplicants(`${dataEngineer} Applicants`);
                    setBiVisualizationApplicants(`${dataBIVisualizationCount} Applicants`);
                    setDataAnalystApplicants(`${dataAnalystCount} Applicants`);
                    setDataModellerApplicants(`${dataModellerCount} Applicants`);
                    setCloudNativeBackendApplicants(`${backendCount} Applicants`);

                } catch (error) {
                    console.error("Error updating applicant counts:", error);
                }
            }

            updateApplicantCounts();
            
            // Other data fetching functions
             const fetchImocha = async () => {
                try {
                    const shortlistedRes = await fetch("https://demotag.vercel.app/api/shortlisted-count");
                    const shortlistedData = await shortlistedRes.json();
                    setInviteCount(shortlistedData.inviteCount);

                    const scoreRes = await fetch("https://demotag.vercel.app/api/available-score-count");
                    const scoreData = await scoreRes.json();
                    setAvailableScoreCount(scoreData.availableScoreCount);
                } catch (error) {
                    console.error("Error fetching counts:", error);
                    setInviteCount("Error");
                    setAvailableScoreCount("Error");
                }
            }

            fetchImocha();

            const loadCandidateCounts = async (ec_mapping) => {
                 try {
                    const response = await fetch(`https://demotag.vercel.app/api/candidate-counts?eng_center=${encodeURIComponent(ec_mapping)}`);
                    const data = await response.json();

                    if (data.error) {
                        console.error(data.error);
                        return;
                    }
                    setUploadCount(data.totalCount);
                    setShortlistedCount(data.shortlistedCount);
                    setRejectedCount(data.rejectedCount);

                } catch (error) {
                    console.error("Error fetching candidate counts:", error);
                }
            }

            if(ecMappingParam) {
                loadCandidateCounts(ecMappingParam);
            }

            // Fetch TAG Overview data
            const fetchTAGOverview = async () => {
                try {
                    const response = await fetch('https://demotag.vercel.app/api/phase-counts');
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    const data = await response.json();
                    
                    // Transform data to group by hr_email
                    const groupedData = {};
                    data.forEach(item => {
                        const email = item.hr_email;
                        if (!groupedData[email]) {
                            groupedData[email] = {
                                tagName: email,
                                prescreening: 0,
                                technicalL1: 0,
                                technicalL2: 0,
                                ecFitment: 0,
                                projectFitment: 0,
                                clientInterview: 0,
                                shortlisted: 0
                            };
                        }
                        
                        const count = parseInt(item.phase_count) || 0;
                        switch(item.phase) {
                            case 'Prescreening':
                                groupedData[email].prescreening += count;
                                break;
                            case 'Move to L1':
                                groupedData[email].technicalL1 += count;
                                break;
                            case 'L2 Technical Round':
                                groupedData[email].technicalL2 += count;
                                break;
                            case 'EC Fitment Round':
                                groupedData[email].ecFitment += count;
                                break;
                            case 'Project Fitment Round':
                                groupedData[email].projectFitment += count;
                                break;
                            case 'Fitment Round':
                                groupedData[email].clientInterview += count;
                                break;
                            case 'Shortlisted in Fitment Round':
                                groupedData[email].shortlisted += count;
                                break;
                        }
                    });
                    
                    const dataArray = Object.values(groupedData);
                    setTagData(dataArray);
                    updateTableDisplay(dataArray, currentPage);
                } catch (error) {
                    const tableBody = document.querySelector('#phaseTable tbody');
                    if (tableBody) {
                        tableBody.innerHTML = '<tr><td colspan="8" style="padding: 12px 15px;">Loading...</td></tr>';
                    }
                }
            };
            



            // Fetch POS-ID Overview data
            const fetchPOSOverview = async () => {
                try {
                    const response = await fetch('https://demotag.vercel.app/api/get-pos-id-count');
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    const data = await response.json();
                    
                    const tableBody = document.querySelector('#posTable tbody');
                    if (tableBody && data.length > 0) {
                        tableBody.innerHTML = data.map(item => `
                            <tr>
                                <td style="padding: 8px 12px; border-bottom: 1px solid #ddd;">${item.posId || 'N/A'}</td>
                                <td style="padding: 8px 12px; border-bottom: 1px solid #ddd;">${item.count || 0}</td>
                            </tr>
                        `).join('');
                    }
                } catch (error) {
                    const tableBody = document.querySelector('#posTable tbody');
                    if (tableBody) {
                        tableBody.innerHTML = '<tr><td colspan="2" style="padding: 12px 15px;">Loading...</td></tr>';
                    }
                }
            };

            // Fetch Leadership Dashboard data
            const fetchLeadershipData = async () => {
                try {
                    const response = await fetch('https://demotag.vercel.app/api/phase-counts');
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    const data = await response.json();
                    
                    // Transform data for chart
                    const hrData = {};
                    data.forEach(item => {
                        const email = item.hr_email;
                        if (!hrData[email]) {
                            hrData[email] = {
                                prescreening: 0,
                                technicalL1: 0,
                                technicalL2: 0,
                                ecFitment: 0,
                                projectFitment: 0,
                                clientInterview: 0,
                                shortlisted: 0
                            };
                        }
                        
                        const count = parseInt(item.phase_count) || 0;
                        switch(item.phase) {
                            case 'Prescreening':
                                hrData[email].prescreening += count;
                                break;
                            case 'Move to L1':
                                hrData[email].technicalL1 += count;
                                break;
                            case 'L2 Technical Round':
                                hrData[email].technicalL2 += count;
                                break;
                            case 'EC Fitment Round':
                                hrData[email].ecFitment += count;
                                break;
                            case 'Project Fitment Round':
                                hrData[email].projectFitment += count;
                                break;
                            case 'Fitment Round':
                                hrData[email].clientInterview += count;
                                break;
                            case 'Shortlisted in Fitment Round':
                                hrData[email].shortlisted += count;
                                break;
                        }
                    });
                    
                    // Create datasets for chart
                    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384'];
                    const datasets = Object.keys(hrData).map((email, index) => ({
                        label: email.split('@')[0], // Use part before @ as label
                        fullLabel: email, // Store full email for tooltip
                        data: [
                            hrData[email].prescreening,
                            hrData[email].technicalL1,
                            hrData[email].technicalL2,
                            hrData[email].ecFitment,
                            hrData[email].projectFitment,
                            hrData[email].clientInterview,
                            hrData[email].shortlisted
                        ],
                        backgroundColor: colors[index % colors.length],
                        borderColor: colors[index % colors.length],
                        borderWidth: 1
                    }));
                    
                    if (hrChart.current) {
                        hrChart.current.data.datasets = datasets;
                        hrChart.current.update();
                    }
                } catch (error) {
                    console.error('Error fetching leadership data:', error);
                }
            };

            // Call the functions
            fetchTAGOverview();
            fetchPOSOverview();
            fetchLeadershipData();
        };

        return () => {
            // Cleanup: remove event listeners and destroy charts
            document.getElementById('toggle-sidebar-btn').removeEventListener('click', toggleSidebar);
            if(statusChart.current) statusChart.current.destroy();
            if(roleChart.current) roleChart.current.destroy();
            if(newStatusChart.current) newStatusChart.current.destroy();
            if(newRoleChart.current) newRoleChart.current.destroy();
            if(secondStatusChart.current) secondStatusChart.current.destroy();
            if(secondRoleChart.current) secondRoleChart.current.destroy();
            if(departmentChart.current) departmentChart.current.destroy();
            if(departmentRoleChart.current) departmentRoleChart.current.destroy();
            if(hrChart.current) hrChart.current.destroy();

        }

    }, []);
    
    const navigateTo = (page) => {
      window.location.href = page;
    }

    const navigateWithECMapping = (destinationPage) => {
        const getECMappingFromURL = () => {
            const params = new URLSearchParams(window.location.search);
            return params.get("ec_mapping");
        }
        const ecMapping = getECMappingFromURL();
        if (ecMapping) {
            const url = `${destinationPage}?ec_mapping=${encodeURIComponent(ecMapping)}`;
            window.location.href = url;
        } else {
            window.location.href = destinationPage;
        }
    }

    const handleLogout = async () => {
        const loginId = localStorage.getItem('loggin-id');

        if (!loginId) {
            console.error('No login ID found. Cannot process logout time update.');
            localStorage.clear(); 
            window.location.href = 'index.html';
            return;
        }
        
        try {
            const response = await fetch('/api/log-logout', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: loginId }),
            });

            if (!response.ok) {
                console.error('Failed to update logout time:', await response.text());
            } else {
                console.log('Logout time updated successfully.');
            }

        } catch (error) {
            console.error('Error during logout API call:', error);
        } finally {
            localStorage.removeItem('loggin-id');
            localStorage.removeItem('userEmail');
            window.location.href = 'index.html'; 
        }
    }
    
    const toggleDateInputs = () => {
        const filterType = document.getElementById("filterSelect").value;
        const customDateRange = document.getElementById("customDateRange");
        customDateRange.style.display = filterType === "custom_range" ? "block" : "none";
    }
    
    const updateFilter = async () => {
        const filterType = document.getElementById("filterSelect").value;
        let startDate = null, endDate = null;

        localStorage.setItem("selectedFilter", filterType);

        if (filterType === "custom_range") {
            startDate = document.getElementById("startDate").value;
            endDate = document.getElementById("endDate").value;

            if (!startDate || !endDate) {
                // You can replace this with a state update to show a message
                alert("Please select both start and end dates.");
                return;
            }
            
            localStorage.setItem("startDate", startDate);
            localStorage.setItem("endDate", endDate);
        }

        await fetch("https://demotag.vercel.app/api/update-visibility", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filterType, startDate, endDate }),
        });

        window.location.reload();
    }
    
    const closePopup = () => {
        document.getElementById("popup").style.display = "none";
    }

    const closeShortlistedPopup = () => {
        document.getElementById("shortlistedPopup").style.display = "none";
    }

    const closeRejectedPopup = () => {
        document.getElementById("rejectedPopup").style.display = "none";
    }


    return (
        <div className="dashboard-page">
            <div id="toast" className="toast"></div>
            <div id="legendTooltip"></div>
            <button id="toggle-sidebar-btn">☰Menu</button>

            <div id="sidebar" className="sidebar-menu hidden">
                <div className="sidebar-option active" data-target="dashboard" data-tooltip="Dashboard" onClick={() => navigateTo('Dashboard.html')}>
                    <FontAwesomeIcon icon={faTachometerAlt} />
                    <span>Dashboard</span>
                </div>
                <div className="sidebar-option active" data-target="RRF" data-tooltip="RRF" onClick={() => navigateTo('Excelread.html')}>
                    <FontAwesomeIcon icon={faTachometerAlt} />
                    <span>Upload RRF</span>
                </div>
                <div className="sidebar-option" data-target="interviews" data-tooltip="Interviews" onClick={() => navigateWithECMapping('ECselection.html')}>
                    <FontAwesomeIcon icon={faUsers} />
                    <span>Recruit</span>
                </div>
                <div className="sidebar-option" data-target="candidateInfo" data-tooltip="candidateInfo" onClick={() => navigateTo('candidatespage.html')}>
                    <FontAwesomeIcon icon={faTasks} /><span>RRF Tracking</span>
                </div>
                <div className="sidebar-option" data-target="candidateInfo" data-tooltip="candidateInfo" onClick={() => navigateTo('GTPrescreening.html')}>
                     <FontAwesomeIcon icon={faTasks} /><span>GT's Prescreening</span>
                </div>
                <div className="sidebar-option" data-target="candidateInfo" data-tooltip="candidateInfo" onClick={() => navigateTo('interview-schedule.html')}>
                    <FontAwesomeIcon icon={faUsers} /><span>My Interviews</span>
                </div>
                <div className="sidebar-option logout-option" data-tooltip="Logout" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    <span>Logout</span>
                </div>
            </div>
            
            <div className="filter-container">
                <h2>Filter Candidates by Date</h2>
                <select id="filterSelect" onChange={toggleDateInputs}>
                    <option value="24_hours">Last 24 Hours</option>
                    <option value="last_week">Last 1 Week</option>
                    <option value="last_15_days">Last 15 Days</option>
                    <option value="custom_range">Custom Range</option>
                </select>

                <div id="customDateRange" style={{ display: 'none', color: 'black' }}>
                    <label htmlFor="startDate">Start Date:</label>
                    <input type="date" id="startDate" />
                    <label htmlFor="endDate">End Date:</label>
                    <input type="date" id="endDate" />
                </div>

                <button onClick={updateFilter}>Apply Filter</button>
            </div>
            
             <div className="partition">
                <div className="main-content1">
                    <div className="dashboard-charts" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                        <div className="dashboard-chart" style={{ flex: 1 }}>
                            <h3>EC Overview</h3>
                            <div className="chart-containers">
                                <canvas id="departmentChart" ref={departmentChartRef} style={{ maxHeight: '148px' }}></canvas>
                            </div>
                        </div>
                        <div className="dashboard-chart" style={{ flex: 1 }}>
                            <h3>Applicants per EC</h3>
                            <div className="chart-containers">
                                <canvas id="departmentRoleChart" ref={departmentRoleChartRef} style={{ maxHeight: '135px' }}></canvas>
                            </div>
                        </div>
                    </div>

                    {ecMapping.includes('Cloud EC') && (
                        <div className="dashboard-charts" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                            <div className="dashboard-chart" style={{ flex: 1 }}>
                                <h3>Cloud EC Overview</h3>
                                <div className="chart-containers">
                                    <canvas id="statusChart" ref={statusChartRef} style={{ maxHeight: '148px' }}></canvas>
                                </div>
                            </div>
                            <div className="dashboard-chart" style={{ flex: 1 }}>
                                <h3>Cloud EC Job Roles</h3>
                                <div className="chart-containers">
                                    <canvas id="roleChart" ref={roleChartRef} style={{ maxHeight: '135px' }}></canvas>
                                </div>
                            </div>
                        </div>
                    )}

                    {showAppEC && (
                        <div className="dashboard-charts" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                            <div className="dashboard-chart1" style={{ flex: 1 }}>
                                <h3>App EC Overview</h3>
                                <div className="chart-containers">
                                    <canvas id="newStatusChart" ref={newStatusChartRef} style={{ maxHeight: '148px' }}></canvas>
                                </div>
                            </div>
                            <div className="dashboard-chart1" style={{ flex: 1 }}>
                                <h3>App EC Job Roles</h3>
                                <div className="chart-containers">
                                    <canvas id="newRoleChart" ref={newRoleChartRef} style={{ maxHeight: '135px' }}></canvas>
                                </div>
                            </div>
                        </div>
                    )}

                    {ecMapping.includes('Data EC') && (
                        <div className="dashboard-charts" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                            <div className="dashboard-chart1" style={{ flex: 1 }}>
                                <h3>Data EC Overview</h3>
                                <div className="chart-containers">
                                    <canvas id="secondStatusChart" ref={secondStatusChartRef} style={{ maxHeight: '148px' }}></canvas>
                                </div>
                            </div>
                            <div className="dashboard-chart1" style={{ flex: 1 }}>
                                <h3>Data EC Job Roles</h3>
                                <div className="chart-containers">
                                    <canvas id="secondRoleChart" ref={secondRoleChartRef} style={{ maxHeight: '135px' }}></canvas>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div id="content">
                        <div className="dashboard-container">
                            <div className="dash-cards" id="card">
                                <h2 id="uploadCount">{uploadCount}</h2>
                                <p>Applications</p>
                            </div>
                            <div id="popup">
                                <div style={{ background: 'white', padding: '20px', borderRadius: '10px', width: '80%', maxWidth: '800px', position: 'relative', marginTop: '88px' }}>
                                    <span onClick={closePopup} style={{ position: 'absolute', top: '10px', right: '15px', fontSize: '24px', fontWeight: 'bold', cursor: 'pointer' }}>&times;</span>
                                    <h2 style={{ marginLeft: '258px', color: 'black' }}>Candidate Applications</h2>
                                    <div style={{ maxWidth: '100%' }}>
                                        <table id="applicationsTable" style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
                                            <thead style={{ backgroundColor: '#f4f4f4' }}>
                                                <tr>
                                                    <th colSpan="7" id="headerSpinner" style={{ padding: '12px', textAlign: 'center', display: 'none' }}>
                                                        <div style={{ width: '30px', height: '30px', border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>
                                                        RRF ID
                                                        <input type="text" id="rrfFilter" placeholder="Search by RRF" style={{ width: '100%', marginTop: '5px' }} />
                                                    </th>
                                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>
                                                        Candidate Name
                                                        <input type="text" id="nameFilter" placeholder="Search by name" style={{ width: '100%', marginTop: '5px' }} />
                                                    </th>
                                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>
                                                        Candidate Email
                                                        <input type="text" id="emailFilter" placeholder="Search by email" style={{ width: '100%', marginTop: '5px' }} />
                                                    </th>
                                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>
                                                        Status
                                                        <input type="text" id="statusFilter" placeholder="Search by status" style={{ width: '100%', marginTop: '5px' }} />
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody></tbody>
                                        </table>
                                    </div>
                                    <div id="pagination" style={{ marginTop: '20px', textAlign: 'center' }}></div>
                                </div>
                            </div>
                            <div className="dash-cards" id="shortlistedCard">
                                <h2 id="shortlistedCount">{shortlistedCount}</h2>
                                <p>Shortlisted</p>
                            </div>
                            <div id="shortlistedPopup">
                                <div style={{ background: 'white', padding: '20px', borderRadius: '10px', width: '80%', maxWidth: '800px', position: 'relative', marginTop: '88px' }}>
                                    <span onClick={closeShortlistedPopup} style={{ position: 'absolute', top: '10px', right: '15px', fontSize: '24px', fontWeight: 'bold', cursor: 'pointer' }}>&times;</span>
                                    <h2 style={{ marginLeft: '258px', color: 'black' }}>Shortlisted Candidates</h2>
                                    <div style={{ maxWidth: '100%' }}>
                                        <table id="shortlistedTable" style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
                                            <thead style={{ backgroundColor: '#f4f4f4' }}>
                                                <tr>
                                                    <th colSpan="7" id="shortlistedSpinner" style={{ padding: '12px', textAlign: 'center', display: 'none' }}>
                                                        <div style={{ width: '30px', height: '30px', border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>
                                                        Rrf Id
                                                        <input type="text" id="rrfFilter" placeholder="Search by rrf" style={{ width: '100%', marginTop: '5px' }} />
                                                    </th>
                                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>
                                                        Candidate Name
                                                        <input type="text" id="shortlistedNameFilter" placeholder="Search by name" style={{ width: '100%', marginTop: '5px' }} />
                                                    </th>
                                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>
                                                        Candidate Email
                                                        <input type="text" id="shortlistedEmailFilter" placeholder="Search by email" style={{ width: '100%', marginTop: '5px' }} />
                                                    </th>
                                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>
                                                        Status
                                                        <input type="text" id="shortlistedStatusFilter" placeholder="Search by status" style={{ width: '100%', marginTop: '5px' }} />
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="dash-cards" id="rejectedCard">
                                <h2 id="rejectedCount">{rejectedCount}</h2>
                                <p>Rejected</p>
                            </div>
                            <div id="rejectedPopup">
                                <div style={{ background: 'white', padding: '20px', borderRadius: '10px', width: '80%', maxWidth: '800px', position: 'relative', marginTop: '88px' }}>
                                    <span onClick={closeRejectedPopup} style={{ position: 'absolute', top: '10px', right: '15px', fontSize: '24px', fontWeight: 'bold', cursor: 'pointer' }}>&times;</span>
                                    <h2 style={{ marginLeft: '258px', color: 'black' }}>Rejected Candidates</h2>
                                    <div style={{ maxWidth: '100%' }}>
                                        <table id="rejectedTable" style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
                                            <thead style={{ backgroundColor: '#f4f4f4' }}>
                                                <tr>
                                                    <th colSpan="7" id="rejectedSpinner" style={{ padding: '12px', textAlign: 'center', display: 'none' }}>
                                                        <div style={{ width: '30px', height: '30px', border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', marginLeft: '50px', animation: 'spin 1s linear infinite' }}></div>
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>
                                                        Rrf Id
                                                        <input type="text" id="rrfFilter" placeholder="Search by rrf" style={{ width: '100%', marginTop: '5px' }} />
                                                    </th>
                                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>
                                                        Candidate Name
                                                        <input type="text" id="rejectedNameFilter" placeholder="Search by name" style={{ width: '100%', marginTop: '5px' }} />
                                                    </th>
                                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>
                                                        Candidate Email
                                                        <input type="text" id="rejectedEmailFilter" placeholder="Search by email" style={{ width: '100%', marginTop: '5px' }} />
                                                    </th>
                                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>
                                                        Status
                                                        <input type="text" id="rejectedStatusFilter" placeholder="Search by status" style={{ width: '100%', marginTop: '5px' }} />
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="dash-cards" id="imochaInviteCard">
                                <h2 id="inviteCount">{inviteCount}</h2>
                                <p>Imocha Invite</p>
                            </div>

                            <div className="dash-cards" id="imochaCompletedCard">
                                <h2 id="availableScoreCount">{availableScoreCount}</h2>
                                <p>Imocha Completed</p>
                            </div>
                        </div>
                    </div>
                    
                     <div className="hrcardnew">
                        <div className="hrcard">
                            <h3 style={{ color: 'black', marginTop: '5px' }}>Leadership Dashboard</h3>

                            <canvas id="hrChart" ref={hrChartRef}></canvas>
                        </div>

                        <div className="phase-table-container" style={{ marginTop: '20px', background: 'white', borderRadius: '8px', padding: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                            <h3 style={{ color: 'black', marginBottom: '10px', textAlign: 'center' }}>TAG Overview</h3>
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <input type="text" id="hrSearchInput" placeholder="Search by TAG Name" style={{ width: '25%', padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }} />
                            </div>
                            <table id="phaseTable" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '14px', marginTop: '10px' }}>
                                <thead>
                                    <tr>
                                        <th style={{ backgroundColor: 'darkcyan', color: 'white', fontWeight: 'bold', borderRight: '2px solid #ddd', padding: '12px 15px' }}>TAG Name</th>
                                        <th style={{ backgroundColor: '#DAF7A6', color: 'black', fontWeight: 'normal', padding: '12px 15px' }}>Prescreening</th>
                                        <th style={{ backgroundColor: '#DAF7A6', color: 'black', fontWeight: 'normal', padding: '12px 15px' }}>Technical L1</th>
                                        <th style={{ backgroundColor: '#DAF7A6', color: 'black', fontWeight: 'normal', padding: '12px 15px' }}>Technical L2</th>
                                        <th style={{ backgroundColor: '#DAF7A6', color: 'black', fontWeight: 'normal', padding: '12px 15px' }}>EC Fitment</th>
                                        <th style={{ backgroundColor: '#DAF7A6', color: 'black', fontWeight: 'normal', padding: '12px 15px' }}>Project Fitment</th>
                                        <th style={{ backgroundColor: '#DAF7A6', color: 'black', fontWeight: 'normal', padding: '12px 15px' }}>Client Interview</th>
                                        <th style={{ backgroundColor: '#DAF7A6', color: 'black', fontWeight: 'normal', padding: '12px 15px' }}>Shortlisted</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan="8" style={{ padding: '12px 15px' }}>Loading...</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div id="paginationControls" style={{ marginTop: '10px', textAlign: 'center' }}></div>
                        </div>
                    </div>
                    
                    <div className="phase-table-container" style={{ marginTop: '20px', background: 'white', borderRadius: '8px', padding: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        <h3 style={{ color: 'black', marginBottom: '10px', textAlign: 'center' }}>POS-ID Overview</h3>
                        <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                            <input type="text" id="posSearchInput" placeholder="Search by POS-ID" style={{ width: '25%', padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }} />
                        </div>
                        <table id="posTable" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '14px', marginTop: '10px' }}>
                            <thead>
                                <tr>
                                    <th style={{ backgroundColor: 'darkcyan', color: 'white', fontWeight: 'bold', borderRight: '2px solid #ddd', padding: '12px 15px' }}>POS-ID</th>
                                    <th style={{ backgroundColor: '#DAF7A6', color: 'black', fontWeight: 'normal', padding: '12px 15px' }}>Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan="2" style={{ padding: '12px 15px' }}>Loading...</td>
                                </tr>
                            </tbody>
                        </table>
                        <div id="posPaginationControls" style={{ marginTop: '10px', textAlign: 'center' }}></div>
                    </div>
                    
                    <h4 style={{ color: 'black', paddingLeft: '200px' }}>By Role</h4>
                    <div className="wrapper">
                        <div className="containerss">
                            <div className="grid">
                                {ecMapping.includes('Cloud EC') && (
                                    <>
                                        <div className="cardss">
                                            <div className="icon software-icon"></div>
                                            <div className="job-title">DevOps<span className="more-icon">...</span></div>
                                            <div className="tags"><span className="tag">Full-time</span><span className="tag">Remote</span></div>
                                            <div className="details1">
                                                <div className="applicants" id="devops-applicants">{devopsApplicants}</div>
                                            </div>
                                        </div>
                                        <div className="cardss">
                                            <div className="icon design-icon">✏️</div>
                                            <div className="job-title">Platform<span className="more-icon">...</span></div>
                                            <div className="tags"><span className="tag">Part-time</span><span className="tag">Hybrid</span></div>
                                            <div className="details1">
                                                <div className="applicants" id="platform-applicants">{platformApplicants}</div>
                                            </div>
                                        </div>
                                        <div className="cardss">
                                            <div className="icon sales-icon">📈</div>
                                            <div className="job-title">Migration<span className="more-icon">...</span></div>
                                            <div className="tags"><span className="tag">Full-time</span><span className="tag">On-site</span></div>
                                            <div className="details1">
                                                <div className="applicants" id="site-applicants">{siteApplicants}</div>
                                            </div>
                                        </div>
                                        <div className="cardss">
                                            <div className="icon hr-icon">👤</div>
                                            <div className="job-title">CloudOps<span className="more-icon">...</span></div>
                                            <div className="tags"><span className="tag">Contract</span><span className="tag">Remote</span></div>
                                            <div className="details1">
                                                <div className="applicants" id="cloudops-applicants">{cloudopsApplicants}</div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {ecMapping.includes('Data EC') && (
                                    <>
                                        <div className="cardss">
                                            <div className="icon database-icon">🗄️</div>
                                            <div className="job-title">Data Engineer<span className="more-icon">...</span></div>
                                            <div className="tags"><span className="tag">Full-time</span><span className="tag">Remote</span></div>
                                            <div className="details1">
                                                <div className="applicants" id="data-engineer-applicants">{dataEngineerApplicants}</div>
                                            </div>
                                        </div>
                                        <div className="cardss">
                                            <div className="icon chart-icon">📊</div>
                                            <div className="job-title">Data – BI Visualization Engineer<span className="more-icon">...</span></div>
                                            <div className="tags"><span className="tag">Part-time</span><span className="tag">Hybrid</span></div>
                                            <div className="details1">
                                                <div className="applicants" id="bi-visualization-applicants">{biVisualizationApplicants}</div>
                                            </div>
                                        </div>
                                        <div className="cardss">
                                            <div className="icon analysis-icon">📈</div>
                                            <div className="job-title">Data Analyst<span className="more-icon">...</span></div>
                                            <div className="tags"><span className="tag">Full-time</span><span className="tag">On-site</span></div>
                                            <div className="details1">
                                                <div className="applicants" id="data-analyst-applicants">{dataAnalystApplicants}</div>
                                            </div>
                                        </div>
                                        <div className="cardss">
                                            <div className="icon model-icon">🔢</div>
                                            <div className="job-title">Data Modeller<span className="more-icon">...</span></div>
                                            <div className="tags"><span className="tag">Contract</span><span className="tag">Remote</span></div>
                                            <div className="details1">
                                                <div className="applicants" id="data-modeller-applicants">{dataModellerApplicants}</div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {ecMapping.includes('App EC') && (
                                    <>
                                        <div className="cardss">
                                            <div className="icon backend-icon">🖥️</div>
                                            <div className="job-title">Cloud Native Application Engineer - Backend<span className="more-icon">...</span></div>
                                            <div className="tags"><span className="tag">Full-time</span><span className="tag">Remote</span></div>
                                            <div className="details1">
                                                <div className="applicants" id="cloud-native-backend-applicants">{cloudNativeBackendApplicants}</div>
                                            </div>
                                        </div>
                                        <div className="cardss">
                                            <div className="icon frontend-icon">🎨</div>
                                            <div className="job-title">Cloud Native Application Engineer - Frontend<span className="more-icon">...</span></div>
                                            <div className="tags"><span className="tag">Full-time</span><span className="tag">Remote</span></div>
                                            <div className="details1">
                                                <div className="applicants" id="cloud-native-frontend-applicants">{cloudNativeFrontendApplicants}</div>
                                            </div>
                                        </div>
                                        <div className="cardss">
                                            <div className="icon lcnc-icon">🔧</div>
                                            <div className="job-title">LCNC Platform Engineer<span className="more-icon">...</span></div>
                                            <div className="tags"><span className="tag">Contract</span><span className="tag">Hybrid</span></div>
                                            <div className="details1">
                                                <div className="applicants" id="lcnc-platform-engineer-applicants">{lcncPlatformEngineerApplicants}</div>
                                            </div>
                                        </div>
                                        <div className="cardss">
                                            <div className="icon integration-icon">🔗</div>
                                            <div className="job-title">Integration Engineer<span className="more-icon">...</span></div>
                                            <div className="tags"><span className="tag">Full-time</span><span className="tag">Remote</span></div>
                                            <div className="details1">
                                                <div className="applicants" id="integration-engineer-applicants">{integrationEngineerApplicants}</div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                <div className="cardss" id="qa-engineer-card" style={{ display: 'none' }}>
                                    <h3>QA Engineer</h3>
                                    <p>Quality Assurance Engineer role</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="right-panel">
                    <div className="container-RRF" id="" style={{ cursor: 'pointer' }}>
                        <div className="header-count" style={{ color: 'black' }}>Total RRF Count</div>
                        <div className="chart-container">
                            <div className="donut-chart"></div>
                            <div className="center-circle">
                                <p className="total-number-RRF">0</p>
                                <span className="total-label">Total Applicants</span>
                            </div>
                        </div>
                        <div className="metrics-grid">
                            <div className="metric">
                                <div className="dot dot-job-boards"></div>
                                <div><span className="">0</span><span className="label">App</span></div>
                            </div>
                            <div className="metric">
                                <div className="dot dot-referrals"></div>
                                <div><span className="">0</span><span className="label">Cloud</span></div>
                            </div>
                            <div className="metric">
                                <div className="dot dot-social"></div>
                                <div><span className="">0</span><span className="label">Data</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="container-RRF" id="clickableContainer" style={{ cursor: 'pointer' }}>
                        <div className="header-count" style={{ color: 'black' }}>L1 iMocha Results</div>
                        <div className="chart-container">
                            <div className="donut-chart"></div>
                            <div className="center-circle">
                                <p className="total-number">1</p>
                                <span className="total-label">Total Applicants</span>
                            </div>
                        </div>
                        <div className="metrics-grid">
                            <div className="metric">
                                <div className="dot dot-job-boards"></div>
                                <div><span className="number">0</span><span className="label">App</span></div>
                            </div>
                            <div className="metric">
                                <div className="dot dot-referrals"></div>
                                <div><span className="number">0</span><span className="label">Cloud</span></div>
                            </div>
                            <div className="metric">
                                <div className="dot dot-social"></div>
                                <div><span className="number">0</span><span className="label">Data</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="candidate-status" style={{ display: 'none' }}>
                        <header className="headers" style={{ textAlign: 'center', width: '100%', marginTop: '-5px' }}>
                            <h1 className="titles" style={{ fontSize: 'large' }}>Candidates Status</h1>
                        </header>
                        <div>
                            <h5 className="task-date" style={{ color: 'black' }}></h5>
                        </div>
                        <div className="tasks-list">
                            <div className="task-item">
                                <div className="progress-ring" id="prescreeningProgressRing" style={{ '--progress': '' }}></div>
                                <div className="task-details1">
                                    <h2 className="task-name">Resume Screening</h2>
                                    <div className="task-info"><span className="task-type">Evaluation</span></div>
                                </div>
                            </div>
                        </div>
                        <div className="task-item">
                            <div className="progress-ring" id="l1ProgressRing" style={{ '--progress': '' }}>10%</div>
                            <div className="task-details1">
                                <h2 className="task-name">L1 Imocha(online)</h2>
                                <div className="task-info"><span className="task-type">Engagement</span><span className="task-date"></span></div>
                            </div>
                        </div>
                        <div className="task-item">
                            <div className="progress-ring" id="l2ProgressRing" style={{ '--progress': ' ' }}>30%</div>
                            <div className="task-details1">
                                <h2 className="task-name">L2 Interview</h2>
                                <div className="task-info"><span className="task-type">Relationship</span><span className="task-date"></span></div>
                            </div>
                        </div>
                        <div className="task-item">
                            <div className="progress-ring" style={{ '--progress': '' }}>0%</div>
                            <div className="task-details1">
                                <h2 className="task-name">Fitment Round</h2>
                                <div className="task-info"><span className="task-type">Selection</span><span className="task-date"></span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;