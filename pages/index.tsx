import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import React from "react";
import {
  Box,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableFooter,
  ButtonGroup,
  TextField,
  Button,
  Typography,
  CircularProgress,
  CardHeader,
  Card,
  CardMedia,
  CardContent,
  TablePagination,
  Alert,
  Slide,
  Snackbar,
} from "@mui/material";
import { InfoTwoTone } from "@mui/icons-material";
const Home: NextPage = ({
  data,
  county,
  stations,
  constituency,
  constResults,
}) => {
  const [prs, setPrs] = React.useState(data); // presidential results
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [err, setError] = React.useState("");
  const [type, setType] = React.useState("county");
  const [count, setCount] = React.useState(49); //pagination

  const [_county, setCounty] = React.useState(county);
  const [_constituency, setConst] = React.useState(constituency);
  const [_station, setStation] = React.useState(stations);
  const [updating, setUpdating] = React.useState(false); // refreshing spinner
  const [candidates, setCandidates] = React.useState([]); // for cards display
  const [page, setPage] = React.useState(0); // current page on pagination
  // just there
  const [searched, setSearched] = React.useState(false);
  let timeout!: number;
  // end points
  let url1 = "https://static.nation.africa/2022/president.json";
  let url2 = "https://static.nation.africa/2022/county.json";
  let url3 = "https://static.nation.africa/2022/stations.json";
  const url4 = "https://static.nation.africa/2022/constituency.json";
  const link =
    "https://elections.nation.africa/images/candidates/2022/ruto.jpg";

  // work horse f the app is this filter function, transforms data object ro arrays
  const filterPayload = (data = [], key = "COUNTY_NO", region = []) => {
    const clean = data.reduce((acc, item) => {
      const county = region.find((reg) => reg[key] === item[key]);
      acc[`group_${item[key]}`] = acc[`group_${item[key]}`] || [];
      item.region = county;
      acc[`group_${item[key]}`].push(item);
      return acc;
    }, {});

    return Object.values(clean);
  };
  /**    width: 70px;
    height: 70px;
 */

  // function for making API request after component mounts
  const fetchData = async (url, setLoading, setData, setError, type) => {
    try {
      setLoading(true);

      const response = await fetch(url);
      const data = await response.json();
      if (type === "county") {
        const payload = setData(data.county.candidates);
      } else if (type === "constituency") {
        setData(data.constituency.candidates);
      } else {
        setData(data);
      }

      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  // button clicks
  const handleClick = (incomingType: string) => {
    return () => {
      clearInterval(timeout);
      // if (incomingType === type) return;
      setType(incomingType);
      if (incomingType === "county")
        fetchData(url1, setLoading, setPrs, setError, "county");
      else if (incomingType === "constituency")
        fetchData(url1, setLoading, setPrs, setError, "constituency");
    };
  };

  // search box
  const handleSearch = (search: string) => {
    clearInterval(timeout);

    let info = [];
    if (search) {
      if (type === "county") {
        info = data.filter((smallItem) => {
          return smallItem?.region?.COUNTY_NAME.toLowerCase()?.includes(
            search.toLowerCase()
          );
        });
        console.log(info, "countiiiii");
        if (info.length) return setPrs(info);
        else setType("constituency");
      }

      if (type === "constituency") {
        info = constituencyRes.filter((smallItem) => {
          return smallItem?.[0]?.region?.CONSTITUENCY_NAME.toLowerCase()?.includes(
            search.toLowerCase()
          );
        });

        if (info.length) return setPrs(info[0]);
        else setType("county");
      }
    }
  };

  React.useEffect(() => {
    const presurl = "https://static.nation.africa/2022/president.json";
    //fetchData(presurl, setLoading, setPrs, setError, "county");
    //fetchData(url2, setLoading, setCounty, setError, "");
    //fetchData(url4, setLoading, setConst, setError, "");
    //fetchData(url3, setLoading, setStation, setError, "");
    //arrayHashmap(prs);

    fetchData(presurl, setUpdating, setCandidates, setError, "");
    // request the server every one minute
    timeout = setInterval(() => {
      fetchData(url1, setUpdating, setPrs, setError, type);
      fetchData(presurl, setLoading, setCandidates, setError, "");
      fetchData(url3, setUpdating, setStation, setError, "");
    }, 60000);
    return () => {
      clearInterval(timeout);
    };
  }, []);

  // pagination
  const handleChangePage = (e, page) => {
    setPage(page);
  };

  const handleChangeRowsPerPage = (e) => {
    setCount(e.target.value);
    setPage(0);
  };
  const [constituencyRes, setconstituencyRes] = React.useState(
    filterPayload(constResults, "CONSTITUENCY_NO", constituency)
  );

  const memoPRS = React.useMemo(() => {
    let key = type === "county" ? "COUNTY_NO" : "CONSTITUENCY_NO";
    const value = type === "county" ? "COUNTY_NAME" : "CONSTITUENCY_NAME";
    const region = type === "county" ? county : constituency;
    const payload = prs.length === 1 ? prs[0] : prs;
    let payload = filterPayload(payload, key, region);
    /*
    const pp = payload.slice().sort((a, z) => {
      console.log(a[0].region[value], z[0].region[value], "sortie");
      return (
        a[0].region[value].toLowerCase() - z[0].region[value].toLowerCase()
      );
    });
    console.log(pp, "ppp");*/
    return payload;
  }, [prs]);

  return (
    <div className={styles.container}>
      {err && <SnackBar open={!!err} message={err} />}
      <Head>
        <title>PRESIDENTIAL ELECTIONS 2022</title>
        <meta
          name=" KENYA General Elections 2022"
          content="KE elections 2022"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section
        style={{
          backgroundImage: "linear-gradient(to top, #accbee 0%, #e7f0fd 100%",
          backgroundSize: "cover",
        }}
        className="py-2"
      >
        {" "}
        <Typography className="text-xl p-2 sm:p-4  mt-2 text-left sm:text-center">
          General Elections 2022 Results:{" "}
          <b>{stations[0]?.PRESIDENTIALTOTAL?.toLocaleString()}</b> of {"  "}
          <b> {stations[1]?.STATIONTOTAL?.toLocaleString()}</b> polling stations
        </Typography>
        <Typography className=" text-left sm:text-center" variant="subtitle1">
          Source: Nation AFrica,
        </Typography>
        <Typography className=" text-left sm:text-center" variant="subtitle1">
          {" "}
          Last updated:{new Date().toDateString()}{" "}
          {new Date().toLocaleTimeString()}
        </Typography>
      </section>
      <main className={` ${styles.main} flex flex-col sm:flex-row`}>
        <section className="w-full py-0 my-0  sm:my-4 sm:py-4 sm:w-1/4 ">
          {updating ? (
            <Box className="my-auto py-2 text-center">
              <CircularProgress color="primary" size="2rem" thickness={4} />
            </Box>
          ) : (
            candidates?.national && (
              <CandidatesComponent candidatess={candidates} />
            )
          )}
        </section>
        <section className="w-full py-2 my-2 sm:w-3/4 sm:my-4 sm:py-4">
          <Box className="  flex gap-6 items-center flex-col sm:flex-row justify-evenly">
            <div>
              <Button
                onClick={handleClick("county")}
                color="primary"
                className={
                  type === "county"
                    ? "bg-blue-500 text-white hover:bg-blue-500 w-10/12 sm:w-40"
                    : " w-10/12 sm:w-60"
                }
                variant={type === "county" ? "contained" : "outlined"}
              >
                County
              </Button>
            </div>
            <div>
              <Button
                color="primary"
                onClick={handleClick("constituency")}
                className={
                  type === "constituency"
                    ? "bg-blue-500 text-white hover:bg-blue-500 w-10/12 sm:w-40"
                    : " w-10/12 sm:w-60"
                }
                variant={type === "constituency" ? "contained" : "outlined"}
              >
                Constituency
              </Button>
            </div>
            <div>
              <SearchInput sendSearch={handleSearch} />
            </div>
          </Box>
          <Box className="my-4 py-2">
            {loading ? (
              <Box className="my-4 py-2 text-center">
                <CircularProgress color="primary" size="4rem" thickness={4} />
              </Box>
            ) : (
              memoPRS.length > 0 && (
                <>
                  <ElectionsTable
                    data={memoPRS}
                    count={{ page, cur: count }}
                    region={type === "county" ? "County" : "Constituency"}
                  />
                  {memoPRS.length > count && (
                    <TablePagination
                      component="div"
                      count={memoPRS.length}
                      page={page}
                      onPageChange={handleChangePage}
                      rowsPerPage={count}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  )}
                </>
              )
            )}
          </Box>
        </section>
      </main>

      <footer className={`${styles.footer}  p-4 bg-purple-700 text-white`}>
        <a> Vince &copy; {new Date().getFullYear()} </a>
      </footer>
    </div>
  );
};

export default Home;

const SearchInput = ({ sendSearch = (f: string) => f }) => {
  const [text, setText] = React.useState("");
  const handleSearch = () => {
    if (text) sendSearch(text);
  };
  return (
    <>
      <TextField
        type="search"
        size="small"
        className="mb-4"
        placeholder="county or constituency"
        onChange={(e) => setText(e.target.value)}
        onBlur={handleSearch}
      />

      <Button
        onClick={handleSearch}
        color="primary"
        className="text-white ml-0 sm:ml-4 bg-blue-500 hover:bg-blue-500 w-11/12 sm:w-32"
      >
        Search
      </Button>
    </>
  );
};
const ElectionsTable = ({ data, region, count }) => {
  const [topLevel] = data;
  let url = "https://elections.nation.africa/images/candidates/2022";
  //console.log("region", region, data);
  let location = region === "County" ? "COUNTY_NO" : "CONSTITUENCY_NO";
  //data = region === "Constituency " ? data[0] : data;
  const { page, cur } = count;
  const ruto = topLevel.find((item) => item.PRESIDENT_ID === 2);
  const raila = topLevel.find((item) => item.PRESIDENT_ID === 1);

  return (
    <Box>
      <Typography></Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>{region}</TableCell>
              <TableCell>
                <div className="flex gap-4 item-center">
                  <div className="w-18 h-10">
                    <img
                      className="w-18 h-10"
                      src={`${url}/${raila?.SMALL_IMAGE}`}
                    />
                  </div>
                  <div>
                    {raila?.FIRST_NAME} {raila?.LAST_NAME}
                  </div>
                  <div
                    style={{ background: `#${raila?.COLOURCODES}` }}
                    className="h-4 w-4 ml-4"
                  ></div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-4 items-center">
                  <div className="w-18 h-10">
                    <img
                      className="w-18 h-10"
                      src={`${url}/${ruto?.SMALL_IMAGE}`}
                    />
                  </div>
                  <div>
                    {" "}
                    {ruto?.FIRST_NAME} {ruto?.LAST_NAME}
                  </div>
                  <div
                    style={{ background: `#${ruto?.COLOURCODES}` }}
                    className="h-4 w-4 ml-4"
                  ></div>
                </div>
              </TableCell>
              <TableCell>Total votes Cast</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * cur, page * cur + cur)
              .map((item, i) =>
                region == "County" ? (
                  <ElectionTable key={i} i={i + page * cur} data={item} />
                ) : (
                  <ElectionTableConstituency
                    key={i}
                    i={i + page * cur}
                    data={item}
                  />
                )
              )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const ElectionTable = ({ data, i }) => {
  const ruto = data.find((item) => item.PRESIDENT_ID === 2);
  const raila = data.find((item) => item.PRESIDENT_ID === 1);
  return (
    <TableRow key={i}>
      {" "}
      <TableCell>{i + 1}.</TableCell>
      <TableCell>{data[0]?.region?.COUNTY_NAME}</TableCell>
      <TableCell>
        {raila?.CANDIDATE_VOTES?.toLocaleString()}{" "}
        <b className="pl-3 ml-4">({raila?.COUNTY_PERCENTAGE?.toFixed(2)})%</b>
      </TableCell>
      <TableCell>
        {ruto?.CANDIDATE_VOTES?.toLocaleString()}{" "}
        <b className="pl-3 ml-4">({ruto?.COUNTY_PERCENTAGE?.toFixed(2)})%</b>
      </TableCell>
      <TableCell>
        {data[1]?.TOTAL_PRESIDENT_COUNTY_VOTES_CAST?.toLocaleString()}
      </TableCell>
    </TableRow>
  );
};

const ElectionTableConstituency = ({ data, i }) => {
  const ruto = data.find((item) => item.PRESIDENT_ID === 2);
  const raila = data.find((item) => item.PRESIDENT_ID === 1);
  return (
    <TableRow key={i}>
      {" "}
      <TableCell>{i + 1}</TableCell>
      <TableCell>{data[0].region?.CONSTITUENCY_NAME}</TableCell>
      <TableCell>
        {raila?.CANDIDATE_VOTES?.toLocaleString()}{" "}
        <b className="pl-3 ml-4">
          ({raila?.CONSTITUENCY_PERCENTAGE?.toFixed(2)})%
        </b>
      </TableCell>
      <TableCell>
        {ruto?.CANDIDATE_VOTES?.toLocaleString()}
        <b className="pl-3 ml-4">
          ({ruto?.CONSTITUENCY_PERCENTAGE?.toFixed(2)})%
        </b>
      </TableCell>
      <TableCell>
        {ruto?.TOTAL_PRESIDENT_CONSTITUENCY_VOTES_CAST?.toLocaleString()}
      </TableCell>
    </TableRow>
  );
};

const CandidatesComponent = ({ candidatess }) => {
  let url = "https://elections.nation.africa/images/candidates/2022";
  const {
    national: {
      candidates: [raila, ruto],
      total_votes_cast,
    },
  } = candidatess;
  return (
    <Box className="flex flex-col gap-6">
      <Card className="w-full sm:w-60 h-80 pt-2 my-4">
        <CardMedia
          component="img"
          className="mx-auto pt-2"
          image={`${url}/${raila.SMALL_IMAGE}`}
          alt="Raila"
          sx={{ width: 200, height: 140 }}
        />

        <CardContent className="p-4">
          <Typography variant="h5" className="text-center">
            {raila.FIRST_NAME} {"  "}
            {raila.LAST_NAME}
          </Typography>

          <Typography className="text-center">
            Votes: {raila.CANDIDATE_VOTES.toLocaleString()} <br />
            <b className="ml-4 text-2xl ">
              {" "}
              {raila.NATIONAL_PERCENTAGE?.toFixed(2)} %
            </b>
          </Typography>
          <Typography className="text-center">
            votes casted: {total_votes_cast.toLocaleString()}
          </Typography>
          <div
            className="h-6 w-full mt-4"
            style={{ background: `#F5C700` }}
          ></div>
        </CardContent>
      </Card>
      <Card className="w-full sm:w-60 h-80 pt-2 my-4">
        <CardMedia
          component="img"
          className="mx-auto pt-2"
          sx={{ width: 200, height: 140 }}
          image={`${url}/${ruto.SMALL_IMAGE}`}
          alt="ruto"
        />

        <CardContent className="p-4">
          <Typography className="text-center" variant="h5">
            {ruto.FIRST_NAME} {ruto.LAST_NAME}
          </Typography>
          <Typography className="text-center">
            Votes: {ruto.CANDIDATE_VOTES.toLocaleString()} <br />
            <b className="ml-4 text-2xl">
              {ruto.NATIONAL_PERCENTAGE?.toFixed(2)} %
            </b>
          </Typography>
          <Typography className="text-center">
            Votes casted: {total_votes_cast.toLocaleString()}
          </Typography>
          <div
            className="h-6 w-full mt-4"
            style={{ background: `#031470` }}
          ></div>
        </CardContent>
      </Card>
    </Box>
  );
};
//mjoy gal
// 298010
export async function getStaticProps() {
  try {
    let url1 = "https://static.nation.africa/2022/president.json";
    let url2 = "https://static.nation.africa/2022/county.json";
    let url3 = "https://static.nation.africa/2022/stations.json";
    const url4 = "https://static.nation.africa/2022/constituency.json";
    const response = await fetch(url1);
    let res2 = await fetch(url2);
    let res3 = await fetch(url3);
    let res4 = await fetch(url4);

    const [data, county, stations, constituency] = await Promise.all([
      response.json(),
      res2.json(),
      res3.json(),
      res4.json(),
    ]);
    return {
      props: {
        data: data.county.candidates,
        county,
        stations,
        constituency,
        constResults: data.constituency.candidates,
      },
      revalidate: 10,
    };
  } catch (error) {
    console.log(error.message);
    return {
      props: {
        data: [],
        county: [],
        stations: [],
        constituency: [],
        constResults: [],
      },
    };
  }
}

const SnackBar = ({ open, message }) => {
  const TransitionComp = (props) => <Slide {...props} direction="down" />;
  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      TransitionComponent={TransitionComp}
      transitionDuration={500}
    >
      <Alert variant="filled" color="error">
        {message}
      </Alert>
    </Snackbar>
  );
};
