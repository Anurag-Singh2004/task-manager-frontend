import {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import api from "../utils/api";

function ProjectView(){
    const {id} = useParams();
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData(){
            try{
                setIsLoading(true);
                const [projectRes, tasksRes] = await Promise.all([
                    api.get(`/projects/${id}`),
                    api.get(`/projects/${id}/tasks`),
                ]);
                setProject(projectRes.data.data);
                setTasks(tasksRes.data.data);
            }catch(err){
                setError(err.message);
            }finally{
                setIsLoading(false);
            }
        }
        fetchData()
    },[id])

    if(isLoading) return <p style={{color:'white', padding:32}}>⏳ Loading...</p>
    if(error) return <p style={{color:'#fca5a5', padding:32}}>❌ {error}</p>
    return (
    <div style={{color:'white', padding:32}}>
      <button onClick={() => navigate('/dashboard')}>← Back</button>
      <h1>{project?.title}</h1>
      <p>Tasks: {tasks.length}</p>
    </div>
  )

}

export default ProjectView;