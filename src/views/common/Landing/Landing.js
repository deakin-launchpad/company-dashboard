import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import logoImage from "../../../assets/logo.png";
import welcomeImage from "../../../assets/welcome.png";

export const Landing = () => {
  const handleRegisterClick = () => {
    window.location.href = "/register";
  };
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
          width: isSmallScreen ? "100px" : "152px", // Adjust the width based on screen size
          height: isSmallScreen ? "21px" : "32px", // Adjust the height based on screen size
          margin: "20px",
        }}
      />

      {/* Box 3 */}
      <Box
        sx={{
          width: "100%", // Set width to 100% to fill the container
          textAlign: "left",
          margin: "120px auto 199px", // Use auto to horizontally center the content
          position: "relative",
          maxWidth: "1020px", // Set a maximum width to prevent content from going too wide
          padding: "0 20px", // Add padding to adjust the content within the container
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
            width: isSmallScreen ? "10%" : "300px", // Adjust the width based on screen size
            // Preserve the aspect ratio of the image
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

        <Button
          variant="contained"
          sx={{
            marginTop: "30px",
            width: "100%", // Set the button width to 100% to fill the container
            maxWidth: "240px", // Set a maximum width for the button
            borderRadius: "8px",
            backgroundColor: "#0D539B",
            typography: {
              fontFamily: "Roboto, sans-serif",
            },
          }}
          onClick={handleRegisterClick}
        >
          Get started &gt;
        </Button>
      </Box>
    </Box>
  );
};
