import React from 'react'
import { List, ListItem, ListItemIcon, ListItemText, Skeleton } from "@mui/material";

function SkeletonProjects() {
    const count = 9
    return (
        <>
            {[...Array(count)].map((_, index) => (
                <ListItem key={index} sx={{ padding: "0px" }}>
                    <ListItemIcon className="min-w-[30px]">
                        <Skeleton variant="circular" width={16} height={16} />
                    </ListItemIcon>
                    <ListItemText
                        primary={<Skeleton variant="text" width="80%" height={16} />}
                    />
                </ListItem>
            ))}
        </>
    )
}

export default SkeletonProjects