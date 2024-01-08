import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';


export function ImageListCustom({imageList, cols}) {
  return (
    <ImageList cols={cols}>
    {console.log('imageListheheh', imageList)}
        {imageList.map((image) => (
            <ImageListItem key={image.key}>
                <img
                    srcSet={`${image.url}`}
                    src={image.url}
                    alt={image.key}
                    loading="lazy"
                />
            </ImageListItem>
        ))}
    </ImageList>
  )
}
