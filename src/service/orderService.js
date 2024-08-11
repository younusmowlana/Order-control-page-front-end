const fetchOrderList = async () => {
    const endpoint = "http://localhost:5000/api/orders/";
  
    try {
      const response = await fetch(endpoint, {
        method: "GET",
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch product data:", error);
      return [];
    }
  };
  
  export default fetchOrderList;
  