import {
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputBase,
  Paper,
  Tooltip,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import {
  ChangeEvent,
  FocusEvent,
  FC,
  FormEvent,
  SetStateAction,
  Dispatch,
} from "react";

const InputForm: FC<{
  classes: {
    readonly [key: string]: string;
  };
  submit: (event: FormEvent<HTMLFormElement>) => void;
  focus: (event: FocusEvent<HTMLInputElement>) => void;
  change: (event: ChangeEvent<HTMLInputElement>) => void;
  setMode: Dispatch<SetStateAction<boolean>>;
}> = ({ classes, submit, focus, change, setMode }) => {
  return (
    <Paper
      component="form"
      className={classes.paper}
      elevation={0}
      onSubmit={submit}
    >
      <Tooltip title="Select if you want more than just 1 page worth of photos.">
        <FormGroup sx={{ backgroundColor: "transparent" }}>
          <FormControlLabel
            control={<Checkbox name="deepSearch" />}
            sx={{ backgroundColor: "transparent" }}
            label="Deep Search"
            onClick={() => setMode((prev) => (!prev ? true : false))}
          />
        </FormGroup>
      </Tooltip>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Images on ImageFinder"
        inputProps={{ "aria-label": "Search for images" }}
        name="urlTextArea"
        onFocus={focus}
        onChange={change}
        onBlur={focus}
      />
      <IconButton
        id="search-button"
        type="submit"
        sx={{ p: "10px" }}
        aria-label="search"
      >
        <Search />
      </IconButton>
    </Paper>
  );
};

export default InputForm;
