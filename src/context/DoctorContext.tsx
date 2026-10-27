import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Doctor } from '../types';
import { DOCTORS } from '../data/hospitalData';
import { fetchDoctorsList, createDoctor, updateDoctor, deleteDoctor } from '../services/doctorService';

interface DoctorContextType {
  doctors: Doctor[];
  isLoading: boolean;
  addDoctor: (doctorData: Partial<Doctor>) => Promise<Doctor | null>;
  editDoctor: (id: string, updates: Partial<Doctor>) => Promise<boolean>;
  removeDoctor: (id: string) => Promise<boolean>;
  toggleDoctorDuty: (id: string, newStatus: 'available' | 'on_leave' | 'emergency_only', dutyNote?: string) => Promise<boolean>;
  refreshDoctors: () => Promise<void>;
  getDoctorById: (id: string) => Doctor | undefined;
  getDoctorsByDepartment: (deptId: string) => Doctor[];
}

const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

export const DoctorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [doctors, setDoctors] = useState<Doctor[]>(DOCTORS);
  const [isLoading, setIsLoading] = useState(true);

  const refreshDoctors = useCallback(async () => {
    try {
      const list = await fetchDoctorsList();
      if (list && list.length > 0) {
        setDoctors(list);
      }
    } catch (e) {
      console.warn('Failed to refresh doctors:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshDoctors();
  }, [refreshDoctors]);

  const addDoctor = async (doctorData: Partial<Doctor>): Promise<Doctor | null> => {
    const created = await createDoctor(doctorData);
    if (created) {
      setDoctors((prev) => [created, ...prev.filter((d) => d.id !== created.id)]);
      return created;
    }
    return null;
  };

  const editDoctor = async (id: string, updates: Partial<Doctor>): Promise<boolean> => {
    const success = await updateDoctor(id, updates);
    if (success) {
      setDoctors((prev) =>
        prev.map((doc) => (doc.id === id ? { ...doc, ...updates } : doc))
      );
    }
    return success;
  };

  const removeDoctor = async (id: string): Promise<boolean> => {
    const success = await deleteDoctor(id);
    if (success) {
      setDoctors((prev) => prev.filter((d) => d.id !== id));
    }
    return success;
  };

  const toggleDoctorDuty = async (
    id: string,
    newStatus: 'available' | 'on_leave' | 'emergency_only',
    dutyNote?: string
  ): Promise<boolean> => {
    return editDoctor(id, { status: newStatus, dutyNote });
  };

  const getDoctorById = useCallback(
    (id: string) => doctors.find((d) => d.id === id),
    [doctors]
  );

  const getDoctorsByDepartment = useCallback(
    (deptId: string) => doctors.filter((d) => d.departmentId === deptId),
    [doctors]
  );

  return (
    <DoctorContext.Provider
      value={{
        doctors,
        isLoading,
        addDoctor,
        editDoctor,
        removeDoctor,
        toggleDoctorDuty,
        refreshDoctors,
        getDoctorById,
        getDoctorsByDepartment,
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
};

export const useDoctors = (): DoctorContextType => {
  const context = useContext(DoctorContext);
  if (!context) {
    throw new Error('useDoctors must be used within a DoctorProvider');
  }
  return context;
};
