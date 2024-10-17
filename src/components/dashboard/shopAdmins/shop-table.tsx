import * as React from 'react';
import Link from 'next/link';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import type { ShopAdmin } from '@/types/ShopAdmin';
import { useSelection } from '@/hooks/use-selection';

interface ShopTableProps {
  count?: number;
  page?: number;
  rows?: ShopAdmin[];
  rowsPerPage?: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  onSelectedChange?: (selected: Set<string>) => void;
}

export function ShopTable({
  // count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  onPageChange,
  onRowsPerPageChange,
  onSelectedChange,
}: ShopTableProps): React.JSX.Element {
  // Filter rows to include only those with approved = true
  const filteredRows = rows.filter((row) => row.approved);

  const rowIds = React.useMemo(() => {
    return filteredRows.map((shop) => shop._id);
  }, [filteredRows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < filteredRows.length;
  const selectedAll = filteredRows.length > 0 && selected?.size === filteredRows.length;

  React.useEffect(() => {
    if (onSelectedChange) {
      onSelectedChange(selected);
    }
  }, [selected, onSelectedChange]);

  const handlePageChange = (event: unknown, newPage: number): void => {
    onPageChange(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              <TableCell>Shop Name</TableCell>
              <TableCell>Shop Owner</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Approved</TableCell>
              <TableCell>Join option</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => {
              const isSelected = selected?.has(row._id);

              return (
                <TableRow hover key={row._id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row._id);
                        } else {
                          deselectOne(row._id);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <Avatar src={row.avatar} />
                      <Typography variant="subtitle2">{row.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.owner ? `${row.owner.first_name} ${row.owner.last_name}` : 'N/A'}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.owner ? row.owner.email : 'N/A'}</TableCell>
                  <TableCell>{row.approved ? 'Verify' : 'NotVerify'}</TableCell>
                  <TableCell>
                    <Link href="#" style={{ textDecorationLine: 'none', fontWeight: 'bolder' }}>
                      Login as Admin
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={filteredRows.length}
        onRowsPerPageChange={handleRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        onPageChange={handlePageChange}
      />
    </Card>
  );
}
