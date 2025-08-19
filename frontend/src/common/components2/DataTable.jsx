import React, { useState, useMemo } from 'react'
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material'
import SearchInput from './SearchInput'
const ROWS_PER_PAGE = 5

const DataTable = ({ columns, rows, title, searchPlaceholder, primaryColor,secondaryColor,sx={} }) => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  // Filter rows by any column
  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows
    const lower = search.trim().toLowerCase()
    return rows.filter(row =>
      columns.some(col =>
        String(row[col.field] ?? '').toLowerCase().includes(lower)
      )
    )
  }, [search, rows, columns])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / ROWS_PER_PAGE))
  const pagedRows = filteredRows.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)

  // Reset to page 1 if search changes
  React.useEffect(() => { setPage(1) }, [search])

  return (
    <Paper elevation={3} sx={{ borderRadius: 0,p:3, mb:4}}>
      <Typography variant="h5" fontSize={{xs:16,md:14}} fontWeight='700' color='black' align="center" sx={{ mb: 2 }}>
        {title}
      </Typography>
      
      {/* Search InputBox */}
      <SearchInput
      value={search}
      
      onChange={e => setSearch(e.target.value)}
      placeholder={searchPlaceholder}
      sx={{ height: { xs: 22, sm: 32, md: 32 }, width:'30%'}}
    />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col, idx) => (
                <TableCell
                  key={col.field}
                  sx={{
                    bgcolor: idx === 0 ? primaryColor : secondaryColor,
                    color: idx === 0 ? '#fff' : '#222',
                    fontWeight: 'bold',
                    fontSize: 12,
                    borderTopLeftRadius: idx === 0 ? 8 : 0,
                    whiteSpace: 'nowrap', // Prevent wrapping
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 160,
                    ...sx
                  }}
                  align={idx === 0 ? 'left' : 'center'}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedRows.map((row, i) => (
              <TableRow key={i}>
                {columns.map((col, idx) => (
                  <TableCell key={col.field} align={idx === 0 ? 'left' : 'center'}>
                    {row[col.field]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {pagedRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          sx={{ minWidth: 36, mr: 1, display:  totalPages > 1 ? 'inline-block' : 'none' }}
        >{"<"}</Button>
        <Button variant="contained" color="primary" sx={{ minWidth: 36 }}>{page}</Button>
        <Button
          variant="contained"
          color="primary"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          sx={{ minWidth: 36, ml: 1 ,display:  totalPages > 1 ? 'inline-block' : 'none'}}
        >{">"}</Button>
      </Box> 
      
    </Paper>
  )
}

export default DataTable