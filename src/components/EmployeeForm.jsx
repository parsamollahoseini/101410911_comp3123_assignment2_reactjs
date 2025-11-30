import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '../services/authService';
import {
    TextField,
    Button,
    Box,
    Alert,
    Grid,
    Avatar
} from '@mui/material';

const EmployeeForm = ({ employee, onClose }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        position: '',
        salary: '',
        date_of_joining: '',
        department: '',
        profile_picture: null
    });
    const [preview, setPreview] = useState('');
    const [error, setError] = useState('');
    const queryClient = useQueryClient();

    useEffect(() => {
        if (employee) {
            setFormData({
                first_name: employee.first_name || '',
                last_name: employee.last_name || '',
                email: employee.email || '',
                position: employee.position || '',
                salary: employee.salary || '',
                date_of_joining: employee.date_of_joining ? employee.date_of_joining.split('T')[0] : '',
                department: employee.department || '',
                profile_picture: null
            });
            if (employee.profile_picture) {
                setPreview(`https://comp-3123-assignment1-pi.vercel.app${employee.profile_picture}`);
            }
        }
    }, [employee]);

    const createMutation = useMutation({
        mutationFn: employeeService.create,
        onSuccess: () => {
            queryClient.invalidateQueries(['employees']);
            onClose();
        },
        onError: (err) => {
            setError(err.response?.data?.message || 'Error creating employee');
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => employeeService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['employees']);
            onClose();
        },
        onError: (err) => {
            setError(err.response?.data?.message || 'Error updating employee');
        }
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                profile_picture: file
            });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (employee) {
                await updateMutation.mutateAsync({
                    id: employee.employee_id,
                    data: formData
                });
            } else {
                await createMutation.mutateAsync(formData);
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Avatar
                    src={preview}
                    sx={{ width: 100, height: 100 }}
                />
            </Box>

            <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ mb: 2 }}
            >
                Upload Profile Picture
                <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </Button>

            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="First Name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Last Name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Position"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Salary"
                        name="salary"
                        type="number"
                        value={formData.salary}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Date of Joining"
                        name="date_of_joining"
                        type="date"
                        value={formData.date_of_joining}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button type="submit" variant="contained" fullWidth>
                    {employee ? 'Update' : 'Create'}
                </Button>
                <Button onClick={onClose} variant="outlined" fullWidth>
                    Cancel
                </Button>
            </Box>
        </Box>
    );
};

export default EmployeeForm;