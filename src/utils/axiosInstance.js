import axios from "axios";
// import { BASE_URL } from "./apiPaths";
// import { error } from "console";


const axiosInstance = axios.create({
            // baseURL: BASE_URL,
            timeout: 10000,
            headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
    },
}) ;
// Request Interceptor
axiosInstance.interceptors. request.use(
        (config) => {
            const accessToken = localStorage. getItem("token") ;
        if (accessToken) {
        config. headers. Authorization = 'Bearer ${accessToken}';
        }
            return config;
        },
        (error) => {
            return Promise. reject (error) ;
    }
);

// Response Intercepetors 
axiosInstance.interceptors.response.use(
    (resposne)=>{
        return resposne
    },
    (error)=>{
        if(error.response){
            if(error.response){
                if(error.response.status==401){
                    window.location.href="/login"
                }
                else if(error.response.status==500){
                    console.error("Server  error. Please try Again later")
                }
            }
        }
        else if(error.code == "ECONNARORTED"){
            console.log("Request timeout . Please try later ")
        }
        return Promise.reject(error);
    }
)


export default axiosInstance;