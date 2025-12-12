import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

function EditProducts(){
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
    })

    return(
        <>
        <h1>Hola soy homelo chino</h1>
        </>
    )
}