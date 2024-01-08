import { FC } from "react";
// Importing MUI
import { Box, Typography } from "@mui/material";

const AboutUs: FC = () => {
  return (
    <Box padding={10}>
      <Typography variant="h4">Our Story</Typography>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut mauris
      vitae ex consectetur dapibus. Vestibulum efficitur, lacus nec auctor
      commodo, turpis velit consequat arcu, ut posuere quam elit eu ipsum.
      <Typography variant="h4">Our Mission</Typography>
      Duis eu ligula quis mauris malesuada bibendum. Sed in arcu ac risus
      tincidunt porttitor. Ut in sollicitudin nisl. Phasellus at massa a augue
      venenatis tempor.
      <Typography variant="h4">Our Team</Typography>
      In hac habitasse platea dictumst. Integer vitae odio in ex fermentum
      varius a nec purus. Proin feugiat volutpat risus, at pellentesque nisi
      laoreet et. Morbi aliquet volutpat est, vel sollicitudin tellus
      pellentesque ut.
      <Typography variant="h4">Our Values</Typography>
      Pellentesque ac tortor eu neque auctor tincidunt. In consequat congue
      libero, vitae facilisis metus suscipit ut. Vestibulum eleifend odio in
      libero hendrerit commodo.
    </Box>
  );
};
export default AboutUs;
