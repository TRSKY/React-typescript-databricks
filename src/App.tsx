import * as React from "react";
import { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import "./styles.css";
interface TimezoneInfo {
  datetime: Date;
  abbreviation: string;
}

interface TimezoneInfoDisplay {
  datetime: string;
  abbreviation: string;
}

interface TimezoneDisplayProps {
  curr: TimezoneInfo;
  dest: TimezoneInfo;
}

interface stateUpdater {
  value: any;
  updateValue: (input: any) => void;
}

interface AutocompleteBoxProps {
  error: stateUpdater;
  options: string[];
  content: stateUpdater;
}

function SetAutocompleteValue(newInput: string | null): stateUpdater {
  const [value, setInput] = useState(null);
  function updateValue(newInput: string | null): void {
    setInput(newInput);
  }
  return { value, updateValue };
}

function AutoCompleteBox(props: AutocompleteBoxProps) {
  const { options, error, content } = props;
  return options.length ? (
    <Autocomplete
      id="time-box"
      onChange={(event, newValue) => {
        error.updateValue(false);
        content.updateValue(newValue);
      }}
      value={content.value}
      options={options}
      getOptionLabel={(option) => option}
      style={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Available Timezones"
          variant="outlined"
          error={error.value}
        />
      )}
    />
  ) : (
    <div>"Loading Timezones"</div>
  );
}

function FetchTimezones() {
  const url = "https://worldtimeapi.org/api/timezone/";
  const [timezones, setTimezones] = useState([]);
  const [currTimeInfoOrg, setCurrTimeInfoOrg] = useState(null);
  const [currTimeInfoDest, setCurrTimeInfoDest] = useState(null);
  const [inputError, toggleInputError] = useState(false);
  const currTimezoneOrigin = SetAutocompleteValue(null);
  const currTimezoneDest = SetAutocompleteValue(null);

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => setTimezones(data));
  }, [url]);

  const handleSubmit = () => {
    if (currTimezoneOrigin.value)
      fetchTimeData(currTimezoneOrigin.value, setCurrTimeInfoOrg);
    if (currTimezoneDest.value)
      fetchTimeData(currTimezoneDest.value, setCurrTimeInfoDest);
  };
  const fetchTimeData = (currTimezone: string, func: (input: any) => void) => {
    fetch(url + currTimezone)
      .then((response) => response.json())
      .then((data) => func(data));
  };
  return (
    <Box>
      <Box display="flex">
        <AutoCompleteBox
          options={timezones}
          error={{ value: inputError, updateValue: toggleInputError }}
          content={currTimezoneOrigin}
        />
        <AutoCompleteBox
          options={timezones}
          error={{ value: inputError, updateValue: toggleInputError }}
          content={currTimezoneDest}
        />
        {timezones ? <Button onClick={handleSubmit}>Submit</Button> : null}
      </Box>
      <Grid>
        {currTimeInfoOrg && currTimeInfoDest ? (
          <TimezoneInfoTable curr={currTimeInfoOrg} dest={currTimeInfoDest} />
        ) : null}
      </Grid>
    </Box>
  );
}

function printDate(date: Date): string {
  var dateAsString = date
    .toString()
    .replace("T", " ")
    .slice(0, date.toString().indexOf("."));
  return dateAsString;
}

function createData(abbreviation: string, datetime: Date): TimezoneInfoDisplay {
  return { abbreviation, datetime: printDate(datetime) };
}

function TimezoneInfoTable(props: TimezoneDisplayProps) {
  const { curr, dest } = props;
  console.log(curr, dest);
  const rows = [
    createData(curr.abbreviation, curr.datetime),
    createData(dest.abbreviation, dest.datetime)
  ];
  return (
    <Grid>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Timezone Abbreviation</TableCell>
            <TableCell>Date and Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r: TimezoneInfoDisplay, i: number) => (
            <TableRow key={i}>
              <TableCell>{r.abbreviation}</TableCell>
              <TableCell>{r.datetime}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Grid>
  );
}

export default function App() {
  return (
    <div className="App">
      <FetchTimezones />
    </div>
  );
}
