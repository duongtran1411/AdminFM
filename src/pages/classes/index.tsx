// components/class/ClassPage.tsx
import { useEffect, useState } from "react";
import ClassList from "../../components/class/ClassList";
import FloatButtonGroup from "../../components/class/FloatButtonGroup";
import ClassService from "../../services/class-service/class.service";
import { Class } from "../../models/classes.model";
const ClassPage = () => {
  const [classesData, setClassesData] = useState<Class[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = async () => {
    try {
      const data = await ClassService.getClasses();
      setClassesData(data.data);
    } catch (error) {
      setError("Error loading classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  if (loading) {
    return <p>Loading classes...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <ClassList classes={classesData} onSuccess={fetchClasses} />
      <FloatButtonGroup onSuccess={fetchClasses} />
    </>
  );
};

export default ClassPage;
