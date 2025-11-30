import { useEffect } from "react";
import { getHome } from "../../services/homeService";



const HomeComponent = () => {


const fetchHome = async () => {
    const response = await getHome();
    console.log(response);

}

useEffect(()=>{
    fetchHome()

},[])

    return (
        <div>
            <h1>Home</h1>
        </div>
    )
}

export default HomeComponent;