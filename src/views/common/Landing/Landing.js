import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import logoImage from "../../../assets/logo.png";
import welcomeImage from "../../../assets/welcome.png";
import { Link } from 'react-router-dom';

export const Landing = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        minHeight: "100vh",
        minWidth: "100vh",
      }}
    >
      {/* Logo */}
      <Box
        component="img"
        src={logoImage}
        alt="Image Not Found"
        style={{
          width: isSmallScreen ? "100px" : "152px",
          height: isSmallScreen ? "21px" : "32px",
          margin: "20px",
        }}
      />

      {/* Box 3 */}
      <Box
        sx={{
          width: "100%",
          textAlign: "left",
          margin: "120px auto 199px",
          position: "relative",
          maxWidth: "1020px",
          padding: "0 20px",
        }}
      >
        {/* Contents of Box 3 */}
        <Box
          component="img"
          src={welcomeImage}
          alt="Welcome Image"
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            height: "100%",
            width: isSmallScreen ? "10%" : "300px",
          }}
        />
        <Typography
          variant="h1"
          sx={{ margin: "24px 0px 5px 0px", lineHeight: 1.2 }}
        >
          Vote for the company<br></br>of your choice!
        </Typography>

        <Typography variant="h6">
          Serving company principals/shareholders to vote for the company
        </Typography>
        <Link to="/login" style={{ textDecoration: 'none', color: 'inherit', width: "100%" }}>
          <Button
            variant="contained"
            sx={{
              marginTop: "30px",
              width: "100%",
              maxWidth: "240px",
            }}
          >
            Get started &gt;
          </Button>
        </Link>
      </Box>
    </Box>
  );
};
