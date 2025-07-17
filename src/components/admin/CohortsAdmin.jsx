import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cohort } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const CohortForm = ({ cohort, onSave, onCancel }) => {
    const [formData, setFormData] = useState(
        cohort || { cohortNumber: '', date: '', time: '', seatsAvailable: '', status: 'open' }
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSelectChange = (value) => {
        setFormData(prev => ({ ...prev, status: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="cohortNumber">Cohort Number</Label>
                <Input id="cohortNumber" name="cohortNumber" type="number" value={formData.cohortNumber} onChange={handleChange} required />
            </div>
            <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" value={formData.date} onChange={handleChange} placeholder="e.g., September 1, 2025" required />
            </div>
            <div>
                <Label htmlFor="time">Time</Label>
                <Input id="time" name="time" value={formData.time} onChange={handleChange} placeholder="e.g., 10:00 AM - 12:00 PM EST" required />
            </div>
            <div>
                <Label htmlFor="seatsAvailable">Seats Available</Label>
                <Input id="seatsAvailable" name="seatsAvailable" type="number" value={formData.seatsAvailable} onChange={handleChange} required />
            </div>
            <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={handleSelectChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="full">Full</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <DialogFooter>
                <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Cohort</Button>
            </DialogFooter>
        </form>
    );
};

export default function CohortsAdmin() {
    const [cohorts, setCohorts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCohort, setEditingCohort] = useState(null);

    const fetchCohorts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedCohorts = await Cohort.list('-cohortNumber');
            setCohorts(fetchedCohorts);
        } catch (err) {
            console.error("Failed to fetch cohorts:", err);
            setError("Could not load cohorts. Please try again later.");
            toast.error("Failed to load cohorts.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCohorts();
    }, []);

    const handleSaveCohort = async (cohortData) => {
        try {
            const dataToSave = {
                ...cohortData,
                cohortNumber: parseInt(cohortData.cohortNumber, 10),
                seatsAvailable: parseInt(cohortData.seatsAvailable, 10),
            };

            if (editingCohort) {
                await Cohort.update(editingCohort.id, dataToSave);
                toast.success(`Cohort #${dataToSave.cohortNumber} updated successfully.`);
            } else {
                await Cohort.create(dataToSave);
                toast.success(`Cohort #${dataToSave.cohortNumber} created successfully.`);
            }
            await fetchCohorts();
            setIsFormOpen(false);
            setEditingCohort(null);
        } catch (err) {
            console.error("Failed to save cohort:", err);
            toast.error("Failed to save cohort.");
        }
    };
    
    const handleAddNew = () => {
        setEditingCohort(null);
        setIsFormOpen(true);
    };

    const handleEdit = (cohort) => {
        setEditingCohort(cohort);
        setIsFormOpen(true);
    };
    
    const handleDelete = async (cohortId, cohortNumber) => {
        if (window.confirm(`Are you sure you want to delete Cohort #${cohortNumber}?`)) {
            try {
                await Cohort.delete(cohortId);
                toast.success(`Cohort #${cohortNumber} deleted.`);
                await fetchCohorts();
            } catch (err) {
                console.error("Failed to delete cohort:", err);
                toast.error("Failed to delete cohort.");
            }
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Manage Cohorts</h3>
                <Button onClick={handleAddNew} size="sm" className="flex items-center gap-2">
                    <PlusCircle className="w-4 h-4" /> Add New Cohort
                </Button>
            </div>
            
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                 <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingCohort ? `Edit Cohort #${editingCohort.cohortNumber}` : 'Add New Cohort'}</DialogTitle>
                    </DialogHeader>
                    <CohortForm
                        cohort={editingCohort}
                        onSave={handleSaveCohort}
                        onCancel={() => {
                            setIsFormOpen(false);
                            setEditingCohort(null);
                        }}
                    />
                </DialogContent>
            </Dialog>

            {isLoading ? (
                <div className="flex justify-center items-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                </div>
            ) : error ? (
                <div className="text-red-600 bg-red-50 p-4 rounded-md flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> {error}
                </div>
            ) : (
                <div className="border rounded-md overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead>Cohort #</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Seats</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cohorts.map((cohort) => (
                                <TableRow key={cohort.id}>
                                    <TableCell className="font-medium">{cohort.cohortNumber}</TableCell>
                                    <TableCell>{cohort.date}</TableCell>
                                    <TableCell>{cohort.time}</TableCell>
                                    <TableCell>{cohort.seatsAvailable}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            cohort.status === 'open' ? 'bg-green-100 text-green-800' :
                                            cohort.status === 'full' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {cohort.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="outline" size="icon" onClick={() => handleEdit(cohort)}>
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button variant="destructive" size="icon" onClick={() => handleDelete(cohort.id, cohort.cohortNumber)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}