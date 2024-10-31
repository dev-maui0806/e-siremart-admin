'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select'; // Import SelectChangeEvent
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CheckFat } from '@phosphor-icons/react';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';

import type { DeliveryMan } from '@/types/delivery';
import { usersClient } from '@/lib/users/client';
import { CustomersFilters } from '@/components/dashboard/deliveryMans/customers-filters';
import { CustomersTable } from '@/components/dashboard/deliveryMans/customers-table';

export default function Page(): React.JSX.Element {
  const [deliveryMen, setDeliveryMen] = useState<DeliveryMan[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedDeliveryIds, setSelectedDeliveryIds] = useState<Set<string>>(new Set());

  // State for managing shop name modal
  const [shopModalOpen, setShopModalOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState('');

  const fetchDeliveryMen = async (): Promise<void> => {
    const result = await usersClient.getDeliveryMen(page, rowsPerPage, searchQuery);
    if (result.data) {
      setDeliveryMen(result.data);
      setTotal(result.total || 0);
      setError(null);
    } else {
      setDeliveryMen([]);
      setTotal(0);
      setError(result.error || 'Failed to fetch delivery personnel');
    }
  };

  useEffect(() => {
    void fetchDeliveryMen();
  }, [page, rowsPerPage, searchQuery]);

  const handleDelete = async (): Promise<void> => {
    const deletePromises = Array.from(selectedDeliveryIds).map((id) => usersClient.deleteUser(id));
    await Promise.all(deletePromises);
    setSelectedDeliveryIds(new Set());
    await fetchDeliveryMen();
  };

  // Open and close modal for selecting shop
  const handleShopModalOpen = () => {
    setShopModalOpen(true);
  };

  const handleShopModalClose = () => {
    setShopModalOpen(false);
  };

  // Handle shop selection
  const handleShopChange = (event: SelectChangeEvent) => {
    // Use SelectChangeEvent here
    setSelectedShop(event.target.value as string);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Delivery Personnel</Typography>
        </Stack>
        <div>
          <Button
            color="error"
            startIcon={<TrashIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={handleDelete}
            disabled={selectedDeliveryIds.size === 0} // Disable if no items are selected
            sx={{ ml: 1 }}
          >
            Delete
          </Button>
          <Button
            color="info"
            startIcon={<CheckFat fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={handleShopModalOpen}
            disabled={selectedDeliveryIds.size === 0} // Disable if no items are selected
            sx={{ ml: 1 }}
          >
            Select Shop or Verify
          </Button>
          {/* <Button color="primary" variant="contained" onClick={handleShopModalOpen} sx={{ ml: 1 }}>
            Select Shop
          </Button> */}
        </div>
      </Stack>
      <CustomersFilters
        onSearch={(query) => {
          setSearchQuery(query);
        }}
      />
      {error && <Typography color="error">{error}</Typography>}
      <CustomersTable
        count={total}
        page={page}
        rows={deliveryMen}
        rowsPerPage={rowsPerPage}
        onPageChange={(newPage) => {
          setPage(newPage);
        }}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
        }}
        onSelectedChange={setSelectedDeliveryIds}
      />

      {/* Modal for Shop Selection */}
      <Dialog open={shopModalOpen} onClose={handleShopModalClose} maxWidth="sm" fullWidth>
        <DialogTitle>Select Shop</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="shop-select-label">Shop Name</InputLabel>
            <Select labelId="shop-select-label" value={selectedShop} onChange={handleShopChange} label="Shop Name">
              <MenuItem value="Shop1">Shop1</MenuItem>
              <MenuItem value="Shop2">Shop2</MenuItem>
              <MenuItem value="Shop3">Shop3</MenuItem>
              {/* Add more shop options as needed */}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleShopModalClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              console.log('Selected Shop:', selectedShop); // You can handle the selected shop here
              handleShopModalClose();
            }}
            color="primary"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
