import { Classroom } from "../../models/classes.model";
import {
  AutoGenerateScheduleDto,
  ClassDay,
  CreateScheduleData,
  ScheduleData,
} from "../../models/schedules.model";
import { Shifts } from "../../models/shifts";
import { Teachers } from "../../models/teacher.model";
import axiosInstance from "../../utils/axiosInstance";

class ScheduleService {
  async findAll(): Promise<ScheduleData[]> {
    try {
      const response = await axiosInstance.get<ScheduleData[]>("/schedules");
      return response.data;
    } catch (error) {
      console.error("Error fetching schedules:", error);
      throw error;
    }
  }

  async findOne(id: number): Promise<ScheduleData> {
    try {
      const response = await axiosInstance.get<ScheduleData>(
        `/schedules/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching schedule with id ${id}:`, error);
      throw error;
    }
  }

  async create(schedule: CreateScheduleData): Promise<ScheduleData> {
    try {
      const response = await axiosInstance.post<ScheduleData>(
        "/schedules",
        schedule,
      );
      return response.data;
    } catch (error) {
      console.error("Error creating schedule:", error);
      throw error;
    }
  }

  async autoGenerateSchedule(
    classId: number,
    schedule: AutoGenerateScheduleDto,
  ): Promise<AutoGenerateScheduleDto> {
    try {
      const response = await axiosInstance.post<AutoGenerateScheduleDto>(
        `/schedules/auto/${classId}`,
        schedule,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: number,
    schedule: Partial<CreateScheduleData>,
  ): Promise<ScheduleData> {
    try {
      const response = await axiosInstance.put<ScheduleData>(
        `/schedules/${id}`,
        schedule,
      );

      if (response.status === 200 && response.data) {
        return response.data;
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error updating schedule with id ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/schedules/${id}`);
    } catch (error) {
      console.error(`Error deleting schedule with id ${id}:`, error);
      throw error;
    }
  }

  async findByClassId(id: string): Promise<ScheduleData[]> {
    try {
      const response = await axiosInstance.get<ScheduleData[]>(
        `/schedules/class/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching schedules:", error);
      throw error;
    }
  }

  async findSchedulesByClassAndDateRange(
    classId: number,
    startDate: string,
    endDate: string,
  ): Promise<ScheduleData[]> {
    try {
      const response = await axiosInstance.get<ScheduleData[]>(
        `/schedules/class/${classId}/schedules`,
        {
          params: {
            startDate,
            endDate,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching schedules for class ${classId} between ${startDate} and ${endDate}:`,
        error,
      );
      throw error;
    }
  }

  async getShifts(): Promise<Shifts[]> {
    try {
      const response = await axiosInstance.get<Shifts[]>("/shifts");
      return response.data;
    } catch (error) {
      console.error("Error fetching shifts:", error);
      throw error;
    }
  }

  async getClassrooms(): Promise<Classroom[]> {
    try {
      const response = await axiosInstance.get<Classroom[]>("/classroom");
      return response.data;
    } catch (error) {
      console.error("Error fetching classrooms:", error);
      throw error;
    }
  }

  async getTeachers(): Promise<Teachers[]> {
    try {
      const response = await axiosInstance.get<Teachers[]>("/teachers");
      return response.data;
    } catch (error) {
      console.error("Error fetching teachers:", error);
      throw error;
    }
  }

  async getModule(): Promise<any[]> {
    try {
      const response = await axiosInstance.get<any[]>("/module");
      return response.data;
    } catch (error) {
      console.error("Error fetching modules:", error);
      throw error;
    }
  }

  async getAvailableClassrooms(
    moduleId: number,
    startDate: string,
    classDay: ClassDay[],
  ): Promise<Classroom[]> {
    try {
      const response = await axiosInstance.get<Classroom[]>(
        `/schedules/available-classrooms`,
        {
          params: {
            moduleId,
            startDate,
            classDay: JSON.stringify(classDay),
          },
          paramsSerializer: (params) => {
            return Object.entries(params)
              .map(([key, value]) => {
                if (key === "classDay") {
                  return `${key}=${encodeURIComponent(value)}`;
                }
                return `${key}=${value}`;
              })
              .join("&");
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching available classrooms:", error);
      throw error;
    }
  }

  async getAvailableTeachers(
    moduleId: number,
    startDate: string,
    classDay: ClassDay[],
  ): Promise<Teachers[]> {
    try {
      const response = await axiosInstance.get<Teachers[]>(
        `/schedules/available-teachers`,
        {
          params: {
            moduleId,
            startDate,
            classDay: JSON.stringify(classDay),
          },
          paramsSerializer: (params) => {
            return Object.entries(params)
              .map(([key, value]) => {
                if (key === "classDay") {
                  return `${key}=${encodeURIComponent(value)}`;
                }
                return `${key}=${value}`;
              })
              .join("&");
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching available teachers:", error);
      throw error;
    }
  }
}

export const scheduleService = new ScheduleService();
