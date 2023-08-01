import { Box, Typography, Button } from "@mui/material";
import logoImage from "../../../assets/logo.png";
import welcomeImage from "../../../assets/welcome.png";

export const Landing = () => {
  const handleRegisterClick = () => {
    window.location.href = "/register";
  };

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        minHeight: "100vh",
      }}
    >
      {/* Logo */}
      <Box
        component="img"
        src={logoImage}
        alt="Image Not Found"
        style={{
          width: "152px",
          height: "32px",
          marginTop: "30px",
          marginLeft: "53px",
        }}
      />

      {/* Box 3 */}
      <Box
        style={{
          width: "1020px",
          height: "300px",

          textAlign: "left",
          margin: "120px 125px 199px 120px",
          position: "relative", // Make the container relatively positioned
        }}
      >
        {/* Contents of Box 3 */}
        <Box
          component="img"
          src={welcomeImage}
          alt="Welcome Image"
          style={{
            position: "absolute", // Position the image absolutely
            top: 0, // Align the image to the top of the container
            right: 0, // Align the image to the right of the container
            height: "100%", // Make sure the image takes the full height of the container
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
            width: "240px",
            borderRadius: "8px",
            backgroundColor: "#0D539B",
            typography: {
              fontFamily: "Roboto, sans-serif", // Use "Roboto" instead of "roboto"
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
