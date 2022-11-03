import { type } from "@testing-library/user-event/dist/type";
import { useEffect, useState } from "react";

import "./App.css";

type Products = {
  id: number;
  name: string;
  marca: string;
};

function App() {
  const [products, setProducts] = useState<Products[]>([]);
  const [inputs, setInputs] = useState({ name: "", marca: "" });
  const [editInputs, setEditInputs] = useState({ name: "", marca: "", id: 0 });
  const [changes, setChanges] = useState<number>(0);
  const [toDelete, setToDelete] = useState<number>(0);
  const [toEdit, setToEdit] = useState<number>(0);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    fetch("https://nodeexample-production.up.railway.app/products", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => setProducts(result))
      .catch((error) => console.log("error", error));
  }, [changes]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch("https://nodeexample-production.up.railway.app/products", {
      method: "POST",
      body: JSON.stringify({ ...inputs }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((result) => {
      result.json().then((data) => {
        console.log(data);
        alert("Producto añadido con éxito");
        setChanges((prev) => prev + 1);
      });
    });
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch(
      `https://nodeexample-production.up.railway.app/products/${editInputs.id}`,
      {
        method: "PUT",
        body: JSON.stringify({ ...editInputs, id: Number(editInputs.id) }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((result) => {
      result.json().then((data) => {
        console.log(data);
        alert("Producto editado con éxito");
        setChanges((prev) => prev + 1);
      });
    });
  };

  const handleDelete = (id: number) => {
    fetch(`https://nodeexample-production.up.railway.app/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((result) => {
      result.json().then((data) => {
        console.log(data);
        alert("Producto borrado con éxito");
        setChanges((prev) => prev + 1);
      });
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //@ts-ignore
    inputs[e.target.name] = e.target.value;
    setInputs({ ...inputs });
  };

  const handleChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    //@ts-ignore
    editInputs[e.target.name] = e.target.value;
    setEditInputs({ ...editInputs, id: toEdit });
  };

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    //@ts-ignore
    let lowerCase = e.target.value.toLowerCase();
    setFilter(lowerCase);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>SISTEMA DE GESTIÓN DE PRODUCTOS</h2>
      </header>

      <div className="container">
        <div className="d-flex justify-content-around my-5 ">
          <form>
            <input
              className="form-control searchInput"
              type="search"
              placeholder="Filtrar producto por nombre o marca"
              aria-label="Search"
              name="search"
              onChange={handleFilter}
            />
          </form>
          <button
            type="button"
            className="btn btn-primary "
            data-bs-toggle="modal"
            data-bs-target="#addModal"
          >
            + nuevo producto
          </button>
        </div>

        <div className="d-flex justify-content-center my-3">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Producto</th>
                <th>Marca</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filter === ""
                ? products.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.name}</td>
                      <td>{p.marca}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-light"
                          data-bs-toggle="modal"
                          data-bs-target="#editModal"
                          onClick={() => setToEdit(p.id)}
                        >
                          <i className="fa-solid fa-pencil"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-light"
                          data-bs-toggle="modal"
                          data-bs-target="#deleteModal"
                          onClick={() => setToDelete(p.id)}
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                : products.map((p) =>
                    p.name.toLowerCase().includes(filter) ||
                    p.marca.toLowerCase().includes(filter) ? (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.name}</td>
                        <td>{p.marca}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-light"
                            data-bs-toggle="modal"
                            data-bs-target="#editModal"
                            onClick={() => setToEdit(p.id)}
                          >
                            <i className="fa-solid fa-pencil"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-light"
                            data-bs-toggle="modal"
                            data-bs-target="#deleteModal"
                            onClick={() => setToDelete(p.id)}
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </td>
                      </tr>
                    ) : null
                  )}
            </tbody>
          </table>
        </div>
      </div>

      {/*Modal agregar producto*/}
      <div
        className="modal fade"
        id="addModal"
        aria-labelledby="addModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="addModalLabel">
                Agregar un producto
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <label className="col-form-label float-start">
                  Ingrese el producto:
                </label>
                <input
                  placeholder={"Ej: Teclado"}
                  name={"name"}
                  className="form-control"
                  onChange={handleChange}
                />
                <label className="col-form-label float-start">
                  Ingrese la marca:
                </label>
                <input
                  placeholder={"Ej: Logitech"}
                  name={"marca"}
                  className="form-control  mb-4"
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  Guardar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/*Modal editar producto*/}
      <div
        className="modal fade"
        id="editModal"
        aria-labelledby="editModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="editModalLabel">
                Editar producto con id {toEdit}:
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEdit}>
                <label className="col-form-label float-start">
                  Ingrese el producto:
                </label>
                <input
                  placeholder={"Producto"}
                  name={"name"}
                  className="form-control"
                  onChange={handleChange2}
                />
                <label className="col-form-label float-start">
                  Ingrese la marca:
                </label>
                <input
                  placeholder={"Marca"}
                  name={"marca"}
                  className="form-control mb-2"
                  onChange={handleChange2}
                />

                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  Guardar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/*Modal borrar*/}
      <div
        className="modal fade"
        id="deleteModal"
        aria-labelledby="deleteModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title fs-5" id="deleteModalLabel">
                Deseas eliminar el producto con el id {toDelete}?
              </h2>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>Atención! no podrás deshacerlo una vez que se haya borrado</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={() => handleDelete(toDelete!)}
              >
                Borrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
