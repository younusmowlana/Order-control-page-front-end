import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  CircularProgress,
  Modal,
  Box,
  Typography,
  TextField,
  IconButton,
  Grid,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import "./productList.css";
import { PhoneAndroid, BrandingWatermark } from "@mui/icons-material";
import { Chip } from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  maxWidth: "800px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    productCode: "",
    productName: "",
    description: "",
    price: 0,
    stockQuantity: 0,
    category: "",
    brand: "",
    images: [],
    isActive: true,
    imagePreviews: [],
  });

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5003/api/product");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle input change for create/edit forms
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Open create product modal
  const handleCreateModalOpen = () => {
    setFormData({
      productCode: "",
      productName: "",
      description: "",
      price: 0,
      stockQuantity: 0,
      category: "",
      brand: "",
      images: [],
      isActive: true,
      imagePreviews: [],
    });
    setOpenCreateModal(true);
  };

  // Open edit product modal
  const handleEditModalOpen = (product) => {
    setSelectedProduct(product);
    setFormData(product);
    setOpenEditModal(true);
  };

  // Open delete product modal
  const handleDeleteModalOpen = (product) => {
    setSelectedProduct(product);
    setOpenDeleteModal(true);
  };

  // Close all modals
  const handleModalClose = () => {
    setOpenCreateModal(false);
    setOpenEditModal(false);
    setOpenDeleteModal(false);
    setSelectedProduct(null);
  };

  // Create a new product
  // const handleCreateProduct = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.post("http://localhost:5003/api/product/", formData);
  //     setProducts([...products, response.data]);
  //     handleModalClose();
  //   } catch (error) {
  //     console.error("Error creating product:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleCreateProduct = async () => {
    setLoading(true);

    const formDataToSend = new FormData();

    formDataToSend.append("productCode", formData.productCode);
    formDataToSend.append("productName", formData.productName);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("stockQuantity", formData.stockQuantity);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("brand", formData.brand);
    formDataToSend.append("isActive", formData.isActive);

    // Append images
    formData.images.forEach((image) => {
      formDataToSend.append("images", image);
    });

    try {
      await axios.post("http://localhost:5003/api/product/", formDataToSend);
      // setProducts([...products, response.data]);
      fetchProducts();
      handleModalClose();
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update a product
  const handleUpdateProduct = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:5003/api/product/${selectedProduct._id}`,
        formData
      );
      setProducts(
        products.map((p) => (p._id === response.data._id ? response.data : p))
      );
      handleModalClose();
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a product
  const handleDeleteProduct = async () => {
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:5003/api/product/${selectedProduct._id}`
      );
      setProducts(products.filter((p) => p._id !== selectedProduct._id));
      handleModalClose();
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const previewUrls = files.map((file) => URL.createObjectURL(file));

    setFormData((prevData) => ({
      ...prevData,
      images: files,
      imagePreviews: previewUrls,
    }));
  };

  return (
    <div className="product-list-container">
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0px 8px 24px rgba(0,0,0,0.12)",
          background: "linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)",
        }}
      >
        <CardHeader
          title={
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#2a2a72" }}>
              📱 Smartphone Inventory
            </Typography>
          }
          action={
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleCreateModalOpen}
            >
              + Add New Device
            </Button>
          }
        />
        <CardContent>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress sx={{ color: "#2a2a72" }} />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} lg={4} key={product._id}>
                  <Card
                    sx={{
                      transition: "all 0.3s ease",
                      border: "2px solid #e0e0ff",
                      borderRadius: 4,
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 12px 20px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        p: 3,
                        background:
                          "linear-gradient(160deg, #f8f9ff 0%, #ffffff 100%)",
                      }}
                    >
                      {/* Product Header */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "#4a4a8a",
                            fontWeight: 700,
                            bgcolor: "#f0f0ff",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                          }}
                        >
                          #{product.productCode}
                        </Typography>
                        <Box>
                          <IconButton
                            onClick={() => handleEditModalOpen(product)}
                            sx={{ color: "#2a2a72" }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteModalOpen(product)}
                            sx={{ color: "#ff4d4d" }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>

                      {/* Product Image Placeholder */}
                      <Box
                        sx={{
                          height: 180,
                          bgcolor: "#f5f5ff",
                          borderRadius: 3,
                          mb: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                        }}
                      >
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.productName}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <Typography
                            variant="caption"
                            sx={{ color: "#a0a0d0" }}
                          >
                            No Image Available
                          </Typography>
                        )}
                      </Box>

                      {/* Product Details */}
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        {product.productName}
                      </Typography>

                      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: "#2a2a72",
                            bgcolor: "#f0f0ff",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                          }}
                        >
                          ${product.price}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            color:
                              product.stockQuantity > 0 ? "#00c853" : "#ff1744",
                          }}
                        >
                          <Box
                            component="span"
                            sx={{
                              width: 8,
                              height: 8,
                              bgcolor:
                                product.stockQuantity > 0
                                  ? "#00c853"
                                  : "#ff1744",
                              borderRadius: "50%",
                              mr: 1,
                            }}
                          />
                          {product.stockQuantity > 0
                            ? "In Stock"
                            : "Out of Stock"}
                        </Typography>
                      </Box>

                      {/* Specifications */}
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flexWrap: "wrap",
                          mt: 2,
                        }}
                      >
                        <Chip
                          label={product.category}
                          icon={<PhoneAndroid fontSize="small" />}
                          size="small"
                          sx={{
                            bgcolor: "#e8e8ff",
                            color: "#4a4a8a",
                            borderRadius: 2,
                          }}
                        />
                        <Chip
                          label={product.brand}
                          icon={<BrandingWatermark fontSize="small" />}
                          size="small"
                          sx={{
                            bgcolor: "#fff0f5",
                            color: "#d81b60",
                            borderRadius: 2,
                          }}
                        />
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Create Product Modal */}
      <Modal open={openCreateModal} onClose={handleModalClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" gutterBottom>
            Create Product
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Product Code"
                name="productCode"
                value={formData.productCode}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12}>
              <input
                accept="image/*"
                type="file"
                multiple
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button variant="contained" component="span">
                  Upload Images
                </Button>
              </label>
              {formData.imagePreviews && formData.imagePreviews.length > 0 && (
                <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {formData.imagePreviews.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt={`Preview ${index}`}
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                  ))}
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Product Name"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                margin="normal"
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock Quantity"
                name="stockQuantity"
                type="number"
                value={formData.stockQuantity}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleModalClose} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateProduct}
              color="primary"
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Create"}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Edit Product Modal */}
      <Modal open={openEditModal} onClose={handleModalClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" gutterBottom>
            Edit Product
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Product Code"
                name="productCode"
                value={formData.productCode}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Product Name"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                margin="normal"
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock Quantity"
                name="stockQuantity"
                type="number"
                value={formData.stockQuantity}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleModalClose} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateProduct}
              color="primary"
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Update"}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Delete Product Modal */}
      <Modal open={openDeleteModal} onClose={handleModalClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" gutterBottom>
            Delete Product
          </Typography>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete the product "
            {selectedProduct?.productName}"?
          </Typography>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleModalClose} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteProduct}
              color="secondary"
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Delete"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ProductList;
