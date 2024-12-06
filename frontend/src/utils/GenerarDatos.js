import React, { useState } from "react";
import {
  camisetas,
  accesorios,
  pantalones,
  sudaderas,
  calzado,
} from "./ProductsList"; // Importamos los arrays de productos

// Función para generar productos con imágenes y traducciones
const generateProductData = async (marca, tipoPrenda, categoria) => {
  // Traducciones de tipos de prendas y categorías
  const translations = {
    camiseta: { es: "camiseta", en: "t-shirt" },
    sudadera: { es: "sudadera", en: "sweatshirt" },
    pantalon: { es: "pantalón", en: "pants" },
    accesorio: { es: "accesorio", en: "accessory" },
    calzado: { es: "calzado", en: "footwear" },
    niño: { es: "niño", en: "children" },
    mujer: { es: "mujer", en: "women" },
    hombre: { es: "hombre", en: "men" },
    colores: {
      negro: { es: "negro", en: "black" },
      blanco: { es: "blanco", en: "white" },
      gris: { es: "gris", en: "gray" },
      azul: { es: "azul", en: "blue" },
      rojo: { es: "rojo", en: "red" },
    },
    materiales: {
      algodón: { es: "algodón", en: "cotton" },
      poliéster: { es: "poliéster", en: "polyester" },
      cuero: { es: "cuero", en: "leather" },
    },
  };

  const tallasPorCategoria = {
    niño: ["XS", "S", "14", "12", "10"],
    mujer: ["S", "M", "L", "XL"],
    hombre: ["M", "L", "XL", "XXL"],
  };

  const colores = ["negro", "blanco", "gris", "azul", "rojo"];
  const materiales = ["algodón", "poliéster", "cuero"];

  const productImages = {
    camiseta: camisetas,
    accesorio: accesorios,
    pantalon: pantalones,
    sudadera: sudaderas,
    calzado: calzado,
  };

  const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const imageArray = productImages[tipoPrenda];
  if (!imageArray) {
    throw new Error(
      `Tipo de prenda '${tipoPrenda}' no encontrado en las imágenes.`
    );
  }

  const productImage = imageArray.find((product) => product.brand === marca);
  const image = productImage ? productImage.src : null;

  const tallas = tallasPorCategoria[categoria] || ["S", "M", "L"];
  const numTallasDisponibles = Math.floor(Math.random() * tallas.length) + 1;
  const tallasDisponibles = [];
  for (let i = 0; i < numTallasDisponibles; i++) {
    const tallaSeleccionada = getRandomElement(tallas);
    if (!tallasDisponibles.includes(tallaSeleccionada)) {
      tallasDisponibles.push(tallaSeleccionada);
    }
  }

  const color = getRandomElement(colores);
  const material = getRandomElement(materiales);

  return {
    nombre: {
      es: `${marca} ${translations[tipoPrenda].es} ${translations[categoria].es}`,
      en: `${marca} ${translations[tipoPrenda].en} ${translations[categoria].en}`,
    },
    descripcion: {
      es: `Este producto es una ${translations[tipoPrenda].es} de la marca ${marca}, perfecto para ${translations[categoria].es}. Está hecho de ${translations.materiales[material].es} y está disponible en color ${translations.colores[color].es}.`,
      en: `This product is a ${translations[tipoPrenda].en} from ${marca}, perfect for ${translations[categoria].en}. It's made of ${translations.materiales[material].en} and comes in ${translations.colores[color].en}.`,
    },
    categoria: {
      es: translations[categoria].es,
      en: translations[categoria].en,
    },
    marca: marca,
    tipo_prenda: {
      es: translations[tipoPrenda].es,
      en: translations[tipoPrenda].en,
    },
    precio: parseFloat((Math.random() * 100).toFixed(2)),
    novedad: Math.random() > 0.5,
    rebaja: Math.random() > 0.5,
    descuento: Math.floor(Math.random() * 30),
    talla: tallasDisponibles,
    color: {
      es: translations.colores[color].es,
      en: translations.colores[color].en,
    },
    material: {
      es: translations.materiales[material].es,
      en: translations.materiales[material].en,
    },
    fecha_agregado: new Date().toISOString().split("T")[0],
    stock: Math.floor(Math.random() * 100) + 1,
    imagen_url: image,
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
    const categorias = ["niño", "mujer", "hombre"];

    try {
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

      const response = await fetch("http://localhost:8001/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(generatedProducts),
      });

      if (!response.ok) {
        throw new Error("Error al guardar los productos en la base de datos.");
      }

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
