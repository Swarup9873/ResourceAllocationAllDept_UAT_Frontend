import React from 'react'
import { Box, Typography, Breadcrumbs } from '@mui/material'

const BreadCrumb =({text1, text2})=> {
  return (
        <div className="w-[90%] mx-auto mt-2">
        <Box className="bg-gray-200 text-black py-0 px-4 relative inline-block">
          <Breadcrumbs aria-label="breadcrumb" className="text-black" separator={<span className="text-black">›</span>}>
            <Typography className="text-black">
              {text1}
            </Typography>
            <Typography className="text-black">{text2}</Typography>
          </Breadcrumbs>

          {/* Arrow Effect */}
          <Box
            component="span"
            className="absolute right-[-20px] top-0 bottom-0 w-5 bg-gray-200 clip-arrow"
          />
          <style>
            {`
              .clip-arrow {
                clip-path: polygon(100% 50%, 0 0, 0 100%);
              }
            `}
          </style>
        </Box>
      </div>
  )
}

export default BreadCrumb