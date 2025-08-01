import React, { useEffect, useState } from 'react';
import {
  Box,
  Checkbox,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Layer type definition
type Layer = {
  id: string;
  name: string;
  visible: boolean;
};

//mock GraphQL API
function fetchLayers(): Promise<Layer[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: "1", name: "Walls", visible: true },
        { id: "2", name: "Doors", visible: true },
        { id: "3", name: "Furniture", visible: false },
        { id: "4", name: "Electrical", visible: true },
      ]);
    }, 1000);
  });
}

export default function LayerPanel() {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [loading, setLoading] = useState(true);

  // Responsive mobile
  const isMobile = useMediaQuery('(max-width 480px)');

  useEffect(() => {
    setLoading(true);
    fetchLayers().then(fetched => {
      setLayers(fetched);
      setLoading(false);
    });
  }, []);

  // Toggle individual layer
  const handleToggle = (id: string) => {
    setLayers(layers =>
      layers.map(layer =>
        layer.id === id ? { ...layer, visible: !layer.visible } : layer
      )
    );
  };

  // Bulk show/hide
  const setAllVisibility = (visible: boolean) => {
    setLayers(layers => layers.map(layer => ({ ...layer, visible })));
  };

  const allVisible = layers.length > 0 && layers.every(l => l.visible);
  const noneVisible = layers.every(l => !l.visible);

  return (
    <Box
      sx={{
        width: isMobile ? '100%' : 320,
        maxWidth: '100%',
        mx: 'auto',
        my: 2,
        p: 2,
        border: '1px solid #ccc',
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: 1,
      }}
      role="region"
      aria-label="Layer visibility panel"
    >
      <Typography variant="h6" component="h2" gutterBottom>
      Chirag Kandpal: Layer Visibility
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress size={28} aria-label="Loading layers" />
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setAllVisibility(true)}
              disabled={allVisible}
              aria-label="Show all layers"
            >
              Show All
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setAllVisibility(false)}
              disabled={noneVisible}
              aria-label="Hide all layers"
            >
              Hide All
            </Button>
          </Box>

          <List dense aria-label="Layer list">
            {layers.map((layer) => (
              <ListItem
                key={layer.id}
                sx={{
                  '&:hover': { bgcolor: 'action.hover' },
                  borderRadius: 1,
                  mb: 1,
                }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label={layer.visible ? "Hide layer" : "Show layer"}
                    onClick={() => handleToggle(layer.id)}
                  >
                    {layer.visible ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                }
                disablePadding
              >
                <Checkbox
                  checked={layer.visible}
                  onChange={() => handleToggle(layer.id)}
                  inputProps={{
                    'aria-label': `Toggle visibility for ${layer.name}`,
                  }}
                  tabIndex={0}
                  sx={{ ml: 1 }}
                />
                <ListItemText
                  primary={layer.name}
                  sx={{ ml: 1, textDecoration: layer.visible ? 'none' : 'line-through' }}
                />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Box>
  );
}
