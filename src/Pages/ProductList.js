import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import './productList.css'; 
import fetchOrderList from "../service/orderService";

const ProductList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const getOrders = async () => {
      const data = await fetchOrderList();
      setOrders(data);
      checkForErrors(data);
      setLoading(false);
    };

    getOrders();
  }, []);

  const checkForErrors = (orders) => {
    for (let order of orders) {
      if (order.picked_quantity !== order.batch_quantity) {
        setErrorMessage(`Incorrect Value: Picked Quantity (${order.picked_quantity}) does not match Batch Quantity (${order.batch_quantity}) for product ${order.product_code}.`);
        setErrorOpen(true);
        break;
      }
    }
  };

  const handleClose = () => {
    setErrorOpen(false);
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <Card className="main-card">
        <CardHeader
          className="main-card-header"
          title={<Typography variant="h6" className="header-title">Order Control</Typography>}
        />
        <CardContent>
          <Grid container spacing={3}>
            {orders.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <Card className="product-card">
                  <CardContent className="product-card-content">
                    <Typography variant="h6" className="product-code">{product.product_code}</Typography>
                    <Typography variant="body2" className="product-info">
                      Order Quantity: {product.order_quantity}
                    </Typography>
                    <Typography variant="body2" className="product-info">
                      Picked Quantity: {product.picked_quantity}
                    </Typography>
                    <Typography variant="body2" className="product-info">
                      Batch Quantity: {product.batch_quantity}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Dialog
        open={errorOpen}
        onClose={handleClose}
      >
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductList;
