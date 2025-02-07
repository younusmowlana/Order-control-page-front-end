import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductList from './Pages/ProductList';
import Login from './Pages/Login';
import Register from './Pages/Register';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Route */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<ProductList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
