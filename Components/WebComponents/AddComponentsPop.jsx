import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Box, Grid, Paper, TextField, styled } from "@mui/material";
import { MenuList } from "@/Data/Layout/Menu";
import { Card, CardBody, CardHeader, Label } from "reactstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaUpload } from "react-icons/fa6";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddComponentsPop(props) {
  const { open, close, title } = props;
  const MainMenu = MenuList?.at(0)?.Items;

  const [items, setItems] = React.useState(MainMenu);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedItems = Array.from(items);
    const [reorderedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, reorderedItem);
    setItems(reorderedItems);
  };

  return (
    <React.Fragment>
      <Dialog
        fullScreen
        open={open}
        onClose={close}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "fixed", top: 0 }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={close}
              aria-label="close"
            >
              <IoCloseCircleOutline />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {title}
            </Typography>
            <Button autoFocus color="inherit" onClick={close}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <Box p={2} mt={8}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Box height={"83vh"} overflow={"auto"}>
                <DragDropContext onDragEnd={onDragEnd}>
                  {items.map((item, index) => (
                    <Droppable key={item.id} droppableId={item.id.toString()}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          <Draggable
                            draggableId={item.id.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <Box
                                key={item?.id}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                pl={"7%"}
                              >
                                {item?.type === "sub" && (
                                  <li className="main-parent-menu">
                                    <Label>{item?.title}</Label>
                                    {item.children?.map((val) => (
                                      <li
                                        key={val.id}
                                        className="main-child-menu"
                                      >
                                        {val.title}
                                      </li>
                                    ))}
                                  </li>
                                )}
                              </Box>
                            )}
                          </Draggable>
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  ))}
                </DragDropContext>
              </Box>
            </Grid>
            <Grid item xs={9}>
              <Card>
                <CardHeader style={{ padding: "12px 20px" }}>
                  <Label style={{ fontWeight: 600, fontSize: "16px" }}>
                    Web Components Attributes
                  </Label>
                </CardHeader>
                <CardBody>
                  <Box>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          id="outlined-basic"
                          label="Tamil Name"
                          variant="outlined"
                          type="text"
                          name="name"
                          size="small"
                          multiline
                          rows={2}
                          // onBlur={handleBlur}
                          // value={inputs?.name}
                          // onChange={handleInputChange}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          id="outlined-basic"
                          label="English Name"
                          variant="outlined"
                          name="eng_name"
                          size="small"
                          multiline
                          rows={2}
                          // value={inputs?.eng_name}
                          // onChange={handleInputChange}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          id="outlined-basic"
                          label="Meta Title"
                          variant="outlined"
                          type="text"
                          name="meta_name"
                          size="small"
                          multiline
                          rows={3}
                          // value={inputs?.meta_name}
                          // onChange={handleInputChange}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          id="outlined-basic"
                          label="Meta Description"
                          variant="outlined"
                          name="meta_desc"
                          size="small"
                          multiline
                          rows={3}
                          // value={inputs?.meta_desc}
                          // onChange={handleInputChange}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          id="outlined-basic"
                          label="Meta Keyword"
                          variant="outlined"
                          name="meta_keyword"
                          size="small"
                          multiline
                          rows={3}
                          // value={inputs?.meta_keyword}
                          // onChange={handleInputChange}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Box mt={"3%"}>
                          {/* {image 
                      ? (
                        <Box
                          display={"flex"}
                          justifyContent={"space-between"}
                          alignItems={"center"}
                        >
                          <Avatar
                            alt=""
                            src={image}
                            sx={{ width: "60px", height: "60px" }}
                          />
                          <p
                            style={{
                              marginBottom: 0,
                              width: "75%",
                              height: "24px",
                              overflow: "auto",
                              textOverflow: "ellipsis",
                              textAlign: "center",
                            }}
                          >
                            {inputs?.cover_image}
                          </p>
                          {imageLoader ? (
                            <Spinner size={"sm"} />
                          ) : (
                            <RiDeleteBin5Line
                              style={{
                                color: "red",
                                fontSize: "16px",
                                cursor: "pointer",
                              }}
                              onClick={handleDelete}
                            />
                          )}
                        </Box>
                      ) : ( */}
                          <Button
                            component="label"
                            variant="outlined"
                            fullWidth
                            sx={{ py: 2.5 }}
                            startIcon={<FaUpload />}
                            // endIcon={imageLoader && <Spinner size={"sm"} />}
                            // disabled={imageLoader}
                          >
                            Category Icon
                            <VisuallyHiddenInput
                              type="file"
                              // onChange={handleUpload}
                              accept="image/*"
                            />
                          </Button>
                          {/* )} */}

                          {/* {errors?.includes("image") && (
                      <p style={{ fontSize: "0.75rem", color: "#d32f2f" }}>
                        please upload Image with less than 1mb
                      </p>
                    )} */}
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </CardBody>
              </Card>
              <Card>
                <CardHeader style={{ padding: "12px 20px" }}>
                  <Label style={{ fontWeight: 600, fontSize: "16px" }}>
                    Mobile Components Attributes
                  </Label>
                </CardHeader>
                <CardBody>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        id="outlined-basic"
                        label="Page Name"
                        variant="outlined"
                        type="text"
                        name="name"
                        size="small"
                        multiline
                        // onBlur={handleBlur}
                        // value={inputs?.name}
                        // onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        id="outlined-basic"
                        label="Layout"
                        variant="outlined"
                        type="text"
                        name="name"
                        size="small"
                        select
                        // onBlur={handleBlur}
                        // value={inputs?.name}
                        // onChange={handleInputChange}
                      />
                    </Grid>
                  </Grid>
                </CardBody>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </React.Fragment>
  );
}
