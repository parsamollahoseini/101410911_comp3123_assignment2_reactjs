import React from 'react';
import {
    Box,
    Typography,
    Avatar,
    Grid,
    Divider
} from '@mui/material';

const EmployeeDetails = ({ employee }) => {
    if (!employee) return null;

    return (
        <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Avatar
                    src={employee.profile_picture ? `https://comp-3123-assignment1-pi.vercel.app${employee.profile_picture}` : ''}
                    sx={{ width: 120, height: 120 }}
                >
                    {employee.first_name[0]}{employee.last_name[0]}
                </Avatar>
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                        First Name
                    </Typography>
                    <Typography variant="body1">{employee.first_name}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                        Last Name
                    </Typography>
                    <Typography variant="body1">{employee.last_name}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                        Email
                    </Typography>
                    <Typography variant="body1">{employee.email}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                        Position
                    </Typography>
                    <Typography variant="body1">{employee.position}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                        Department
                    </Typography>
                    <Typography variant="body1">{employee.department}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                        Salary
                    </Typography>
                    <Typography variant="body1">${employee.salary?.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                        Date of Joining
                    </Typography>
                    <Typography variant="body1">
                        {employee.date_of_joining ? new Date(employee.date_of_joining).toLocaleDateString() : 'N/A'}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

export default EmployeeDetails;