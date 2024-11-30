import React, { useState } from "react";
import {
  camisetas,
  accesorios,
  pantalones,
  sudaderas,
  calzado,
} from "./ProductsList"; // Importamos los arrays de productos

// Función para generar productos con imágenes
const generateProductData = async (marca, tipoPrenda, categoria) => {
  // Tallas asociadas a cada categoría
  const tallasPorCategoria = {
    niño: ["XS", "S", "14", "12", "10"],
    mujer: ["S", "M", "L", "XL"],
    hombre: ["M", "L", "XL", "XXL"],
  };

  const categorias = ["niño", "mujer", "hombre"];
  const colores = ["negro", "blanco", "gris", "azul", "rojo"];
  const materiales = ["algodón", "poliéster", "cuero"];

  // Mapear cada tipo de prenda con su array respectivo
  const productImages = {
    camiseta: camisetas,
    accesorio: accesorios,
    pantalon: pantalones,
    sudadera: sudaderas,
    calzado: calzado,
  };

  const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Verificamos que el tipo de prenda exista en el objeto productImages
  const imageArray = productImages[tipoPrenda];

  if (!imageArray) {
    throw new Error(
      `Tipo de prenda '${tipoPrenda}' no encontrado en las imágenes.`
    );
  }

  // Buscar la imagen correspondiente en el array del tipo de prenda
  const productImage = imageArray.find((product) => product.brand === marca);

  // Verificamos si se encontró la imagen, si no, asignamos una por defecto
  const image = productImage ? productImage.src : null;

  // Seleccionamos las tallas dependiendo de la categoría (niño, mujer, hombre)
  const tallas = tallasPorCategoria[categoria] || ["S", "M", "L"];

  // Generar un número aleatorio de tallas disponibles entre 1 y el número de tallas disponibles
  const numTallasDisponibles = Math.floor(Math.random() * tallas.length) + 1;
  const tallasDisponibles = [];
  for (let i = 0; i < numTallasDisponibles; i++) {
    // Seleccionamos una talla aleatoria de la lista
    const tallaSeleccionada = getRandomElement(tallas);
    // Añadimos la talla si no ha sido añadida antes (para evitar duplicados)
    if (!tallasDisponibles.includes(tallaSeleccionada)) {
      tallasDisponibles.push(tallaSeleccionada);
    }
  }

  return {
    nombre: `${marca} ${tipoPrenda} ${categoria}`,
    categoria: categoria,
    marca: marca,
    tipo_prenda: tipoPrenda,
    precio: parseFloat((Math.random() * 100).toFixed(2)),
    novedad: Math.random() > 0.5,
    rebaja: Math.random() > 0.5,
    descuento: Math.floor(Math.random() * 30),
    talla: tallasDisponibles, // Usamos las tallas generadas
    color: [getRandomElement(colores)],
    material: getRandomElement(materiales),
    fecha_agregado: new Date().toISOString().split("T")[0],
    stock: Math.floor(Math.random() * 100) + 1,
    imagen_url: image, // Añadimos la imagen correspondiente
  };
};

const ProductGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);

  const handleGenerateAndSave = async () => {
    setIsLoading(true);
    setMessage("Generando productos...");

    const marcas = ["Nike", "Adidas", "Puma", "Supreme", "Vans"];
    const tiposPrenda = [
      "camiseta",
      "sudadera",
      "pantalon",
      "accesorio",
      "calzado",
    ];
    const categorias = ["niño", "mujer", "hombre"]; // Ahora tenemos las tres categorías

    try {
      // Generar productos
      const generatedProducts = [];
      for (const marca of marcas) {
        for (const tipoPrenda of tiposPrenda) {
          for (const categoria of categorias) {
            for (let i = 0; i < 5; i++) {
              const product = await generateProductData(
                marca,
                tipoPrenda,
                categoria
              );
              generatedProducts.push(product);
            }
          }
        }
      }

      // Guardar los productos en la base de datos
      const response = await fetch("http://localhost:8001/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Asegúrate de enviar en formato JSON
        },
        body: JSON.stringify(generatedProducts), // Convertimos los productos a JSON
      });

      if (!response.ok) {
        throw new Error("Error al guardar los productos en la base de datos.");
      }

      // Si la respuesta es exitosa, actualizamos el estado
      setProducts(generatedProducts);
      setMessage("Productos generados y guardados exitosamente!");
      console.log("Productos generados y guardados en la base de datos");
    } catch (error) {
      setMessage("Error al generar o guardar los productos: " + error.message);
      console.error("Error al guardar los productos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleGenerateAndSave} disabled={isLoading}>
        {isLoading ? "Generando..." : "Generar y Guardar Productos"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ProductGenerator;
