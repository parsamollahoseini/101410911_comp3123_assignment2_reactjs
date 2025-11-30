import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Typography,
    Box,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    AppBar,
    Toolbar,
    TextField,
    Grid,
    Avatar
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Visibility as ViewIcon,
    Add as AddIcon,
    Logout as LogoutIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeDetails from '../components/EmployeeDetails';

const Dashboard = () => {
    const [openForm, setOpenForm] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [searchParams, setSearchParams] = useState({ department: '', position: '' });
    const [isSearching, setIsSearching] = useState(false);

    const { logout } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: employeesData, isLoading, error } = useQuery({
        queryKey: ['employees'],
        queryFn: employeeService.getAll
    });

    const { data: searchData, refetch: searchEmployees } = useQuery({
        queryKey: ['searchEmployees', searchParams],
        queryFn: () => employeeService.search(searchParams),
        enabled: false
    });

    const deleteMutation = useMutation({
        mutationFn: employeeService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['employees']);
        }
    });

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await deleteMutation.mutateAsync(id);
            } catch (error) {
                console.error('Error deleting employee:', error);
            }
        }
    };

    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setOpenForm(true);
    };

    const handleView = (employee) => {
        setSelectedEmployee(employee);
        setOpenDetails(true);
    };

    const handleAddNew = () => {
        setSelectedEmployee(null);
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setOpenForm(false);
        setSelectedEmployee(null);
    };

    const handleCloseDetails = () => {
        setOpenDetails(false);
        setSelectedEmployee(null);
    };

    const handleSearch = async () => {
        if (searchParams.department || searchParams.position) {
            setIsSearching(true);
            await searchEmployees();
        } else {
            setIsSearching(false);
            queryClient.invalidateQueries(['employees']);
        }
    };

    const handleClearSearch = () => {
        setSearchParams({ department: '', position: '' });
        setIsSearching(false);
        queryClient.invalidateQueries(['employees']);
    };

    const displayData = isSearching ? searchData?.data : employeesData;

    if (isLoading) return <Typography>Loading...</Typography>;
    if (error) return <Alert severity="error">Error loading employees</Alert>;

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Employee Management System
                    </Typography>
                    <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Search by Department"
                                value={searchParams.department}
                                onChange={(e) => setSearchParams({ ...searchParams, department: e.target.value })}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Search by Position"
                                value={searchParams.position}
                                onChange={(e) => setSearchParams({ ...searchParams, position: e.target.value })}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button
                                variant="contained"
                                startIcon={<SearchIcon />}
                                onClick={handleSearch}
                                sx={{ mr: 1 }}
                            >
                                Search
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={handleClearSearch}
                            >
                                Clear
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h5">Employees</Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddNew}
                    >
                        Add Employee
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Profile</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Position</TableCell>
                                <TableCell>Department</TableCell>
                                <TableCell>Salary</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayData && displayData.length > 0 ? (
                                displayData.map((employee) => (
                                    <TableRow key={employee.employee_id}>
                                        <TableCell>
                                            <Avatar
                                                src={employee.profile_picture ? `https://comp-3123-assignment1-pi.vercel.app${employee.profile_picture}` : ''}
                                                alt={`${employee.first_name} ${employee.last_name}`}
                                            >
                                                {employee.first_name[0]}{employee.last_name[0]}
                                            </Avatar>
                                        </TableCell>
                                        <TableCell>{employee.first_name} {employee.last_name}</TableCell>
                                        <TableCell>{employee.email}</TableCell>
                                        <TableCell>{employee.position}</TableCell>
                                        <TableCell>{employee.department}</TableCell>
                                        <TableCell>${employee.salary?.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleView(employee)} color="info">
                                                <ViewIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleEdit(employee)} color="primary">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(employee.employee_id)} color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        No employees found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>

            <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
                <DialogTitle>{selectedEmployee ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
                <DialogContent>
                    <EmployeeForm employee={selectedEmployee} onClose={handleCloseForm} />
                </DialogContent>
            </Dialog>

            <Dialog open={openDetails} onClose={handleCloseDetails} maxWidth="sm" fullWidth>
                <DialogTitle>Employee Details</DialogTitle>
                <DialogContent>
                    <EmployeeDetails employee={selectedEmployee} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDetails}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Dashboard;