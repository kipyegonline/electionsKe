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
} from "@mui/material";
import { InfoTwoTone } from "@mui/icons-material";
const Home: NextPage = ({ data, county, stations, constituency }) => {
  const [prs, setPrs] = React.useState(data);
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [err, setError] = React.useState("");
  const [type, setType] = React.useState("county");
  const [count, setCount] = React.useState(47);
  const [_county, setCounty] = React.useState(county);
  const [_constituency, setConst] = React.useState(constituency);
  const [_station, setStation] = React.useState(stations);
  const [updating, setUpdating] = React.useState(false);
  const [candidates, setCandidates] = React.useState([]);
  let timeout;

  let url1 = "https://static.nation.africa/2022/president.json";
  let url2 = "https://static.nation.africa/2022/county.json";
  let url3 = "https://static.nation.africa/2022/stations.json";
  const url4 = "https://static.nation.africa/2022/constituency.json";
  const link =
    "https://elections.nation.africa/images/candidates/2022/ruto.jpg";

  const filterPayload = (data = [], key = "COUNTY_NO", region = []) => {
    const clean = data.reduce((acc, item) => {
      const county = region.find((reg) => reg[key] === item[key]);
      acc[`group_${item[key]}`] = acc[`group_${item[key]}`] || [];
      item.region = county;
      acc[`group_${item[key]}`].push(item);
      return acc;
    }, {});
    // console.log(clean, "clean");
    return Object.values(clean);
  };
  /**    width: 70px;
    height: 70px;
 */
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
  const handleClick = (incomingType: string) => {
    return () => {
      clearInterval(timeout);
      if (incomingType === type) return;
      setType(incomingType);
      if (incomingType === "county")
        fetchData(url1, setLoading, setPrs, setError, "county");
      else if (incomingType === "constituency")
        fetchData(url1, setLoading, setPrs, setError, "constituency");
    };
  };
  const handleSearch = () => {
    clearInterval(timeout);
    return alert("Search functional unavailable for now....");
    let info = null;
    if (search) {
      info = prs.find((item) =>
        item?.region?.COUNTY_NAME?.includes(search.toUpperCase())
      );
      if (info) return setPrs(info);
      info = prs.find((item) =>
        item?.region?.CONSTITUENCY_NAME?.includes(search.toUpperCase())
      );
      if (info) return setPrs(info);
      return setError("No result found");
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
    timeout = setInterval(() => {
      fetchData(url1, setUpdating, setPrs, setError, type);
      fetchData(presurl, setLoading, setCandidates, setError, "");
    }, 60000);
    return () => {
      clearInterval(timeout);
    };
  }, []);

  const memoPRS = React.useMemo(() => {
    let key = type === "county" ? "COUNTY_NO" : "CONSTITUENCY_NO";
    const region = type === "county" ? county : constituency;
    let payload = filterPayload(prs, key, region);
    //payload = [...payload].sort((a, z) => a[key] - z[key]);

    return payload;
  }, [prs]);
  console.log(memoPRS, candidates, "rss");
  return (
    <div className={styles.container}>
      <Head>
        <title>GENERAL ELECTIONS 2022</title>
        <meta name="General Elections 2022" content="KE elections 2022" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section>
        {" "}
        <Typography className="text-xl p-2 sm:p-4  mt-4 text-left sm:text-center">
          General Elections 2022 Results:{" "}
          <b>{stations[0].PRESIDENTIALTOTAL?.toLocaleString()}</b> of {"  "}
          <b> {stations[1]?.STATIONTOTAL.toLocaleString()}</b> polling stations
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
        <section className="w-full py-2 my-2  sm:my-4 sm:py-4 sm:w-1/4 ">
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
                    ? "bg-blue-500 text-white hover:bg-blue-500"
                    : ""
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
                    ? "bg-blue-500 text-white hover:bg-blue-500"
                    : ""
                }
                variant={type === "constituency" ? "contained" : "outlined"}
              >
                Constituency
              </Button>
            </div>
            <div>
              <TextField
                type="search"
                size="small"
                placeholder="Search county or constituency"
                onChange={(e) => setSearch(e.target.value)}
                onBlur={handleSearch}
              />

              <Button
                onClick={handleSearch}
                color="primary"
                className="text-white ml-4 bg-blue-500 hover:bg-blue-500"
              >
                Search
              </Button>
            </div>
          </Box>
          <Box className="my-4 py-2">
            {loading ? (
              <Box className="my-4 py-2 text-center">
                <CircularProgress color="primary" size="4rem" thickness={4} />
              </Box>
            ) : (
              memoPRS.length > 0 && (
                <ElectionsTable
                  data={memoPRS}
                  region={type === "county" ? "County" : "Constituency"}
                />
              )
            )}
          </Box>
        </section>
      </main>

      <footer className={styles.footer}>
        <a> Vince &copy; {new Date().getFullYear()} </a>
      </footer>
    </div>
  );
};

export default Home;

const ElectionsTable = ({ data, region }) => {
  const [topLevel] = data;
  let url = "https://elections.nation.africa/images/candidates/2022";
  //console.log("region", region, data);
  let location = region === "County" ? "COUNTY_NO" : "CONSTITUENCY_NO";
  //data = region === "Constituency " ? data[0] : data;
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
                      src={`${url}/${topLevel[0]?.SMALL_IMAGE}`}
                    />
                  </div>
                  <div>
                    {topLevel[0]?.FIRST_NAME} {topLevel[0]?.LAST_NAME}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-4 items-center">
                  <div className="w-18 h-10">
                    <img
                      className="w-18 h-10"
                      src={`${url}/${topLevel[1]?.SMALL_IMAGE}`}
                    />
                  </div>
                  <div>
                    {" "}
                    {topLevel[1]?.FIRST_NAME} {topLevel[1]?.LAST_NAME}
                  </div>
                </div>
              </TableCell>
              <TableCell>Total votes Cast</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, i) =>
              region == "County" ? (
                <ElectionTable key={i} i={i} data={item} />
              ) : (
                <ElectionTableConstituency key={i} i={i} data={item} />
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
      <TableCell>{i + 1}</TableCell>
      <TableCell>{data[0]?.region?.COUNTY_NAME}</TableCell>
      <TableCell>
        {raila?.CANDIDATE_VOTES?.toLocaleString()}{" "}
        <b className="pl-3 ml-4">({Math.ceil(raila?.COUNTY_PERCENTAGE)})%</b>
      </TableCell>
      <TableCell>
        {ruto?.CANDIDATE_VOTES?.toLocaleString()}{" "}
        <b className="pl-3 ml-4">({Math.ceil(ruto?.COUNTY_PERCENTAGE)})%</b>
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
          ({Math.ceil(raila?.CONSTITUENCY_PERCENTAGE)})%
        </b>
      </TableCell>
      <TableCell>
        {ruto?.CANDIDATE_VOTES?.toLocaleString()}
        <b className="pl-3 ml-4">
          ({Math.ceil(ruto?.CONSTITUENCY_PERCENTAGE)})%
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
      <Card className="w-60 h-80">
        <CardMedia
          component="img"
          className="mx-auto"
          image={`${url}/${raila.SMALL_IMAGE}`}
          alt="Raila"
          sx={{ width: 200, height: 140 }}
        />

        <CardContent className="p-4">
          <Typography variant="h5" className="text-center">
            {raila.FIRST_NAME} {"  "}
            {raila.LAST_NAME}
          </Typography>

          <Typography>
            Votes: {raila.CANDIDATE_VOTES.toLocaleString()}{" "}
            <b className="ml-4"> ({Math.ceil(raila.NATIONAL_PERCENTAGE)} %)</b>
          </Typography>
          <Typography>
            votes casted: {total_votes_cast.toLocaleString()}
          </Typography>
        </CardContent>
      </Card>
      <Card className="w-60 h-80">
        <CardMedia
          component="img"
          className="mx-auto"
          sx={{ width: 200, height: 140 }}
          image={`${url}/${ruto.SMALL_IMAGE}`}
          alt="ruto"
        />

        <CardContent className="p-4">
          <Typography className="text-center" variant="h5">
            {ruto.FIRST_NAME} {ruto.LAST_NAME}
          </Typography>
          <Typography>
            Votes: {ruto.CANDIDATE_VOTES.toLocaleString()}
            <b className="ml-4">({Math.ceil(ruto.NATIONAL_PERCENTAGE)} %)</b>
          </Typography>
          <Typography>
            Votes casted: {total_votes_cast.toLocaleString()}
          </Typography>
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
      props: { data: data.county.candidates, county, stations, constituency },
      revalidate: 10,
    };
  } catch (error) {
    console.log(error.message);
    return {
      props: { data: [], county: [], stations: [], constituency: [] },
    };
  }
}
