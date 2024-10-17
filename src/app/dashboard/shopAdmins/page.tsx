'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';

// import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import type { ShopAdmin } from '@/types/shopAdmin';
import { shopClient } from '@/lib/shopAdmins/client';
import { ShopFilters } from '@/components/dashboard/shopAdmins/shop-filters';
import { ShopTable } from '@/components/dashboard/shopAdmins/shop-table';

export default function Page(): React.JSX.Element {
  const [customers, setCustomers] = useState<ShopAdmin[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState<ShopAdmin>({
    _id: '',
    name: '',
    description: '',
    email: '',
    password: '',
    approved: false,
    first_name: '',
    last_name: '',
    phone_number: '',
    ownerId: '',
    owner: {
      first_name: '',
      last_name: '',
      email: '',
    },
  });

  const fetchCustomers = async (): Promise<void> => {
    const result = await shopClient.getUniversities(page, rowsPerPage, searchQuery);
    if (result.data) {
      setCustomers(result.data);
      setTotal(result.total || 0);
      setError(null);
    } else {
      setCustomers([]);
      setTotal(0);
      setError(result.error || 'Failed to fetch customers');
    }
  };

  useEffect(() => {
    void fetchCustomers();
  }, [page, rowsPerPage, searchQuery]);

  const handleAdd = async (): Promise<void> => {
    await shopClient.addShop(newCustomer);
    setOpen(false);
    setNewCustomer({
      _id: '',
      name: '',
      description: '',
      email: '',
      password: '',
      approved: false,
      first_name: '',
      last_name: '',
      phone_number: '',
      owner: {
        first_name: '',
        last_name: '',
        email: '',
      },
    });
    await fetchCustomers();
  };

  const handleDelete = async (): Promise<void> => {
    const deletePromises = Array.from(selectedCustomerIds).map((id) => shopClient.deleteShop(id));
    await Promise.all(deletePromises);
    setSelectedCustomerIds(new Set());
    await fetchCustomers();
  };

  const handleApprove = async (): Promise<void> => {
    const approve = Array.from(selectedCustomerIds).map((id) => shopClient.approveShop(id));
    await Promise.all(approve);
    setSelectedCustomerIds(new Set());
    await fetchCustomers();
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Shops</Typography>
        </Stack>
        <div>
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={() => {
              setOpen(true);
            }}
          >
            Add
          </Button>
          <Button
            color="error"
            startIcon={<TrashIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={handleDelete}
            disabled={selectedCustomerIds.size === 0}
            sx={{ ml: 1 }}
          >
            Delete
          </Button>
          <Button
            color="info"
            startIcon={<TrashIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={handleApprove}
            disabled={selectedCustomerIds.size === 0}
            sx={{ ml: 1 }}
          >
            Approve
          </Button>
        </div>
      </Stack>
      <ShopFilters
        onSearch={(query) => {
          setSearchQuery(query);
        }}
      />
      {error && <Typography color="error">{error}</Typography>}
      <ShopTable
        count={total}
        page={page}
        rows={customers}
        rowsPerPage={rowsPerPage}
        onPageChange={(newPage) => {
          setPage(newPage);
        }}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
        }}
        onSelectedChange={setSelectedCustomerIds} // Pass the setSelectedCustomerIds function
      />
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <DialogTitle>Add New Shop</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Shop Name"
            type="text"
            fullWidth
            variant="standard"
            value={newCustomer.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setNewCustomer({ ...newCustomer, name: e.target.value });
            }}
          />
          <TextField
            margin="dense"
            label="Shop Description"
            type="text"
            fullWidth
            variant="standard"
            value={newCustomer.description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setNewCustomer({ ...newCustomer, description: e.target.value });
            }}
          />
          <TextField
            margin="dense"
            label="Owner First Name"
            type="text"
            fullWidth
            variant="standard"
            value={newCustomer.first_name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setNewCustomer({ ...newCustomer, first_name: e.target.value });
            }}
          />
          <TextField
            margin="dense"
            label="Owner Last Name"
            type="text"
            fullWidth
            variant="standard"
            value={newCustomer.last_name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setNewCustomer({ ...newCustomer, last_name: e.target.value });
            }}
          />
          <TextField
            margin="dense"
            label="Owner Phone Number"
            type="text"
            fullWidth
            variant="standard"
            value={newCustomer.phone_number}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setNewCustomer({ ...newCustomer, phone_number: e.target.value });
            }}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            value={newCustomer.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setNewCustomer({ ...newCustomer, email: e.target.value });
            }}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            value={newCustomer.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setNewCustomer({ ...newCustomer, password: e.target.value });
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleAdd} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
