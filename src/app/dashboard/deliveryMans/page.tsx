'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { CheckFat } from '@phosphor-icons/react';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { notification } from 'antd';

import axios from 'axios';

import type { DeliveryMan } from '@/types/delivery';
import { usersClient } from '@/lib/users/client';
import { CustomersFilters } from '@/components/dashboard/deliveryMans/customers-filters';
import { CustomersTable } from '@/components/dashboard/deliveryMans/customers-table';

import axiosInstance from '../../../../utils/axiosInstance';

export default function Page(): React.JSX.Element {
  const [deliveryMen, setDeliveryMen] = useState<DeliveryMan[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedDeliveryIds, setSelectedDeliveryIds] = useState<Set<string>>(new Set());

  // State for managing shop data and modal
  const [shops, setShops] = useState<{ _id: string; name: string }[]>([]);
  const [shopModalOpen, setShopModalOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState('');

  // Function to fetch delivery men data
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

  // Function to fetch all shops and set them in the shops state
  const fetchAllShops = async () => {
    try {
      const response = await axiosInstance.get('/api/v1/shop/admin', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}`,
        },
      });
      setShops(response.data.data);
    } catch (error) {
      console.error('Error fetching shops:', error);
    }
  };

  // Call fetchAllShops on component mount to get shop list
  useEffect(() => {
    fetchDeliveryMen();
    fetchAllShops(); // Fetch and set all shops on initial load
  }, [page, rowsPerPage, searchQuery]);

  const handleDelete = async (): Promise<void> => {
    if (selectedDeliveryIds.size === 0) {
      notification.warning({
        message: 'No Selection',
        description: 'Please select at least one row to delete.',
        placement: 'topRight',
        duration: 3,
      });
      return;
    }

    const deletePromises = Array.from(selectedDeliveryIds).map((id) => usersClient.deleteUser(id));
    await Promise.all(deletePromises);
    setSelectedDeliveryIds(new Set());
    await fetchDeliveryMen();
  };

  const handleShopModalOpen = () => {
    if (selectedDeliveryIds.size === 0) {
      notification.warning({
        message: 'No Selection',
        description: 'Please select at least one row to proceed.',
        placement: 'topRight',
        duration: 3,
      });
      return;
    }
    setShopModalOpen(true);
  };

  const handleShopModalClose = () => {
    setShopModalOpen(false);
  };

  const handleShopChange = (event: SelectChangeEvent) => {
    setSelectedShop(event.target.value as string);
  };

  const handleShopConfirm = () => {
    setDeliveryMen((prevDeliveryMen) =>
      prevDeliveryMen.map((person) =>
        selectedDeliveryIds.has(person._id) ? { ...person, shopName: selectedShop } : person
      )
    );
    handleShopModalClose();
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
            disabled={deliveryMen.length === 0}
            sx={{ ml: 1 }}
          >
            Delete
          </Button>
          <Button
            color="info"
            startIcon={<CheckFat fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={handleShopModalOpen}
            disabled={deliveryMen.length === 0}
            sx={{ ml: 1 }}
          >
            Select Shop or Verify
          </Button>
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
            <Select
              labelId="shop-select-label"
              value={selectedShop}
              onChange={handleShopChange}
              label="Shop Name"
            >
              {shops.map((shop) => (
                <MenuItem key={shop._id} value={shop.name}>
                  {shop.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleShopModalClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleShopConfirm} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
