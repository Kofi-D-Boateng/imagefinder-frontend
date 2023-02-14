import {
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputBase,
  Paper,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { FC, FormEvent } from "react";

const InputForm: FC<{
  classes: {
    readonly [key: string]: string;
  };
  submit: (event: FormEvent<HTMLFormElement>) => void;
}> = ({ classes, submit }) => {
  return (
    <Paper component="form" className={classes.paper} onSubmit={submit}>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox name="deepSearch" />}
          label="Deep Search"
        />
      </FormGroup>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Images on ImageFinder"
        inputProps={{ "aria-label": "Search for images" }}
        name="urlTextArea"
      />
      <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
        <Search />
      </IconButton>
    </Paper>
  );
};

export default InputForm;
