import {useState} from "react";
import FileUploader from "../components/FileUploader";
import MyFiles from "../components/MyFiles";
import axios from "axios";

export default function HomePage(){
  const [data, setData] = useState([]);
  
    const fetchFiles = async () => {
      try {
        const res = await axios.get("http://localhost:5000/list-files");
        return res;
      } catch (err) {
        console.error("Error fetching files", err);
      }
    };
    return(
       <div className="min-h-screen w-screen flex">
      <div className="w-[40vw] min-h-screen">
        <FileUploader fetchFiles={fetchFiles} data={data} setData={setData}/>
      </div>
      <div className="w-[60vw] min-h-screen border-l-2">
        <MyFiles fetchFiles={fetchFiles} data={data} setData={setData}/>
      </div>
    </div>
    );
}