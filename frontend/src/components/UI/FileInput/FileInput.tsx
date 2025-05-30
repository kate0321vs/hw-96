import { Button, TextField } from '@mui/material';
import {useEffect, useRef, useState} from 'react';
import Grid from '@mui/material/Grid';

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  label: string;
  file: File | null;
}

const FileInput: React.FC<Props> = ({ onChange, name, label, file}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] ) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName('');
    }
    onChange(e);
  }

  useEffect(() => {
    if (!file) {
      setFileName("");
    } else {
      setFileName(file.name);
    }
  }, [file]);

  const activateInput = () => {
    if(inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
      <>
        <input type="file"
               ref={inputRef} name={name}
               style={{ display: 'none' }}
               onChange={onFileChange}/>

        <Grid container spacing={2} alignItems="center" sx={{ width: '100%' }}>
          <Grid  sx={{ flexGrow: 1 }}>
            <TextField value={fileName} label={label} disabled fullWidth/>
          </Grid>
          <Grid>
            <Button variant="contained" onClick={activateInput}>Browse</Button>
          </Grid>
        </Grid>
      </>
  );
};

export default FileInput;