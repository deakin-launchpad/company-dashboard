import { Box } from "@mui/material";
import logoImage from "../../../assets/logo.png";
import welcomeImage from "../../../assets/welcome.png";

export const Landing = () => {
  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <Box
        component="img"
        src={logoImage}
        alt="Image Not Found"
        sx={{
          width: "152px",
          height: "32px",
          position: "absolute",
          top: "30px",
          left: "53px",
        }}
      />
      {/* Box 3 */}
      <Box
        sx={{
          width: "90%",
          height: "45%",
          position: "absolute",
          top: "57%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          border: "1px solid black",
          display: "flex",
          alignItems: "center",
          padding: "0 20px", // Adjust left and right padding
          gap: "62.5px", // Create space between the box and image
        }}
      >
        {/* Image on the far right */}
        <Box
          component="img"
          src={welcomeImage}
          alt="Welcome Image"
          sx={{
            width: "35%",
            height: "100%",
            position: "absolute",
            top: "50%",
            right: 0,
            transform: "translateY(-50%)",
          }}
        />
      </Box>
    </Box>
  );
};
