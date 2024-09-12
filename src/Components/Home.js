import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Nav,
  Tab,
  Button,
  Card,
  Col,
  Row,
  Modal,
  Alert,
} from "react-bootstrap";
import { fetchRecipes } from "../Apis/ApiServer"; // Import the fetchRecipes function
import { FaTrash } from "react-icons/fa";
const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState("");
  const [addedToWeeks, setAddedToWeeks] = useState({});
  const [hovered, setHovered] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const getRecipes = async () => {
      const data = await fetchRecipes();
      setRecipes(data);
    };

    getRecipes();
  }, []);

  const handleCardClick = (id, week = null) => {
    if (week) {
      setSelectedCard(id === selectedCard ? null : id);
    } else {
      setSelectedCard(id === selectedCard ? null : id);
    }
  };

  const handleAddToWeekClick = () => {
    if (selectedCard) {
      setShowModal(true);
    } else {
      alert("Please select a card first.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveWeek = () => {
    if (selectedCard && selectedWeek) {
      setAddedToWeeks((prev) => ({
        ...prev,
        [selectedWeek]: [...(prev[selectedWeek] || []), selectedCard],
      }));
      setShowModal(false);
      setSelectedWeek("");
    }
  };
  const handleDeleteCard = (cardId, week) => {
    setAddedToWeeks((prev) => ({
      ...prev,
      [week]: (prev[week] || []).filter((id) => id !== cardId),
    }));
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const isCardAddedToWeek = (week) => {
    return (addedToWeeks[week] || []).includes(selectedCard);
  };

  const isCardSelected = (id) => {
    return selectedCard === id;
  };

  return (
    <div className="container-fluid" style={styles.Maincontainer}>
      <div className="container" style={styles.container}>
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12 text-center">
            <h1 style={styles.header}>Optimize your Meal</h1>
            <p style={styles.subHeader}>
              Select a meal to add for the week. You will be able to edit,
              modify, and change the meals throughout the week.
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12">
            <h1 style={styles.weeklyOrders}>Weekly Orders</h1>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-lg-12 col-md-12 col-sm-12">
            <Tab.Container defaultActiveKey="allMeals">
              <div style={styles.tabContainer}>
                <Nav
                  variant="tabs"
                  className="justify-content-around"
                  style={styles.navTabs}
                >
                  <Nav.Item>
                    <Nav.Link eventKey="allMeals" style={styles.tabLink}>
                      All Meals
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="week1" style={styles.tabLink}>
                      Week 1
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="week2" style={styles.tabLink}>
                      Week 2
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="week3" style={styles.tabLink}>
                      Week 3
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="week4" style={styles.tabLink}>
                      Week 4
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <div className="text-center">
                      <Button
                        variant="primary"
                        style={styles.addButton}
                        onClick={handleAddToWeekClick}
                      >
                        Add to Week
                      </Button>
                    </div>
                  </Nav.Item>
                </Nav>
              </div>
              <div style={styles.tabContentContainer}>
                <Tab.Content className="mt-4">
                  <Tab.Pane eventKey="allMeals">
                    <Row>
                      {recipes.length > 0 ? (
                        recipes.map((recipe) => (
                          <Col
                            key={recipe.id}
                            xs={12}
                            sm={6}
                            md={4}
                            lg={4}
                            className="mb-4"
                          >
                            <Card
                              style={{
                                ...styles.card,
                                border:
                                  selectedCard === recipe.id
                                    ? "2px solid #007bff"
                                    : "none",
                              }}
                              onClick={() => handleCardClick(recipe.id)}
                            >
                              <Card.Img
                                variant="top"
                                src={recipe.image}
                                style={styles.cardImage}
                              />
                              <Card.Body>
                                <Card.Title>{recipe.name}</Card.Title>
                                <Card.Text>
                                  <p style={{ fontSize: "12px" }}>
                                    {recipe.instructions.join(" ")}
                                  </p>
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))
                      ) : (
                        <p>Loading recipes...</p>
                      )}
                    </Row>
                  </Tab.Pane>
                  {["week1", "week2", "week3", "week4"].map((week) => (
                    <Tab.Pane eventKey={week} key={week}>
                      <h2>
                        {week.charAt(0).toUpperCase() + week.slice(1)} Meals
                      </h2>
                      <Row>
                        {(addedToWeeks[week] || []).length > 0 ? (
                          (addedToWeeks[week] || []).map((cardId) => {
                            const recipe = recipes.find((r) => r.id === cardId);
                            return recipe ? (
                              <Col
                                key={recipe.id}
                                xs={12}
                                sm={6}
                                md={4}
                                lg={4}
                                className="mb-4"
                              >
                                <Card
                                  style={{
                                    ...styles.card,
                                    ...(isCardSelected(cardId) &&
                                      styles.selectedOverlay),
                                  }}
                                  onClick={() => handleCardClick(cardId, week)}
                                >
                                  <Card.Img
                                    variant="top"
                                    src={recipe.image}
                                    style={styles.cardImage}
                                  />
                                  <Card.Body>
                                    <Card.Title>{recipe.name}</Card.Title>
                                    <Card.Text>
                                      <p style={{ fontSize: "12px" }}>
                                        {recipe.instructions.join(" ")}
                                      </p>
                                    </Card.Text>
                                  </Card.Body>
                                  {isCardSelected(cardId) && (
                                    <div style={styles.trashIconContainer}>
                                      <FaTrash
                                        style={{
                                          ...styles.trashIcon,
                                          ...(hovered && styles.trashIconHover),
                                        }}
                                        onMouseEnter={() => setHovered(true)}
                                        onMouseLeave={() => setHovered(false)}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteCard(cardId, week);
                                        }}
                                      />
                                    </div>
                                  )}
                                </Card>
                              </Col>
                            ) : null;
                          })
                        ) : (
                          <Col xs={12}>
                            <p
                              style={{
                                textAlign: "center",
                                marginTop: "35px",
                                fontSize: "20px",
                                // paddingBottom: "115px",
                              }}
                            >
                              No meal added
                            </p>
                          </Col>
                        )}
                      </Row>
                    </Tab.Pane>
                  ))}
                </Tab.Content>
              </div>
            </Tab.Container>
          </div>
        </div>
      </div>
      {showAlert && (
        <Alert variant="success" style={styles.alert}>
          Recipe has been removed from the week!
        </Alert>
      )}
      {/* Modal for Adding to Week */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Modal.Title>Select Week</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-row justify-content-around">
            {["week1", "week2", "week3", "week4"].map((week) => (
              <Button
                key={week}
                variant="outline-primary"
                onClick={() => setSelectedWeek(week)}
                disabled={isCardAddedToWeek(week)}
                style={{ margin: "0.5rem", width: "100%" }}
              >
                {week.charAt(0).toUpperCase() + week.slice(1)}
                {isCardAddedToWeek(week)}
              </Button>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveWeek}
            disabled={!selectedWeek}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const styles = {
  Maincontainer: {
    height: "100%",
    minHeight: "100%",
    background: "linear-gradient(to bottom right, lightpink, lightblue)",
    padding: "20px",
    boxSizing: "border-box",
    margin: "0 auto",
    with: "100%",
  },
  container: {
    padding: "20px",
    paddingLeft: "150px",
    paddingRight: "150px",
    height: "100%",
  },
  header: {
    fontSize: "36px",
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: "18px",
    color: "#777",
    marginBottom: "50px",
  },
  weeklyOrders: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  tabContainer: {
    backgroundColor: "white",
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  navTabs: {
    border: "none",
  },
  tabLink: {
    padding: "15px 15px",
    margin: "0 15px",
    fontSize: "15px",
    fontWeight: "bold",
    border: "none",
  },
  addButton: {
    padding: "12px 30px",
    fontSize: "14px",
  },
  tabContentContainer: {
    marginTop: "20px",
  },
  card: {
    cursor: "pointer",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s, box-shadow 0.2s",
    height: "95%",
    overflowY: "auto",
    marginTop: "40px",
    width: "95%",
  },

  cardImage: {
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
    height: "200px",
    objectFit: "cover",
  },
  modal: {
    border: "none",
    borderRadius: "10px",
  },
  selectedOverlay: {
    position: "relative",
    backgroundColor: "rgba(0,0,0,0.7)",
    transition: "background-color 0.3s ease",
  },
  trashIconContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 2, // ensures the icon stays on top
  },
  trashIcon: {
    color: "white",
    fontSize: "24px", // size of the trash icon
  },
  trashIconHover: {
    transform: "scale(1.3)", // scale the icon on hover
    transition: "transform 0.3s ease",
    cursor: "pointer",
    fontSize: "34px",
  },
  alert: {
    position: "fixed",
    top: "20px",
    right: "20px",
    zIndex: 1000,
  },
};

export default Home;

