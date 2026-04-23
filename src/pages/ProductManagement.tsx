import { useState } from "react"; 
import AddProductForm from "../pages/AddProductForm";
import DisplayProducts from "../components/DisplayProducts";

const ProductManagement = () => {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleProductAdded = () => {
        setRefreshKey((prev) => prev + 1); 
    };

    return (
        <div>
            <h1>Product Management</h1>
            <AddProductForm onProductAdded={handleProductAdded} />
            <DisplayProducts refreshKey={refreshKey} />
        </div>
    );
};

export default ProductManagement;