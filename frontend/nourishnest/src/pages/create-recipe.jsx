import {useState} from "react";
import {
    Box,
    Container,
    Stack,
    TextField,
    Typography,
    Autocomplete,
    Chip,
    Grid
} from "@mui/material";;
import {getCSRFToken, parseTimeToSeconds} from "../utils.js";
import { useNavigate } from 'react-router-dom';


const CreateRecipe = () => {
    // vars
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [calories, setCalories] = useState(null);
    const [tags, setTags] = useState(''); // Comma-separated string of tags
    const [ingredients, setIngredients] = useState([]);
    const [steps, setSteps] = useState([]);
    const [image, setImage] = useState(null);

    // time
    const [prepTimeHours, setPrepTimeHours] = useState(null);
    const [prepTimeMinutes, setPrepTimeMinutes] = useState(null);
    const [prepTimeSeconds, setPrepTimeSeconds] = useState(null);

    const [cookTimeHours, setCookTimeHours] = useState(null);
    const [cookTimeMinutes, setCookTimeMinutes] = useState(null);
    const [cookTimeSeconds, setCookTimeSeconds] = useState(null);

    const hourOptions = [...Array(24).keys()];
    const minuteSecondOptions = [...Array(60).keys()];

    // error handling and navigation
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // dropdown tag suggestoins
    const tagSuggestions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Low-Carb', 'Low-Fat', 'Low-Sodium', 'Low-Sugar', 'Paleo', 'Pescatarian', 'Whole30'];


    // API call
    function createRecipe(recipe) {
        // csrf protection

        return fetch('http://localhost:8000/api/savedrecipes/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
            body: JSON.stringify(recipe),
            credentials: 'include'
        })
            .then(response => {
                // Check if the response is ok (status in the range 200-299)
                if (!response.ok) {
                    // Convert non-2xx HTTP responses into errors:
                    return response.json().then(data => Promise.reject(data));
                }
                return response.json();
            })
            .catch(err => {
                // Handle network errors and json parsing errors
                console.error("Error", err);
                throw err; // Re-throwing the error so it can be caught by the caller
            });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        // calculate vars
        const formattedTags = tags.split(',').map(tag => tag.trim()); // Convert comma-separated string to array
        const prepTime = prepTimeHours * 3600 + prepTimeMinutes * 60 + prepTimeSeconds;
        const cookTime = cookTimeHours * 3600 + cookTimeMinutes * 60 + cookTimeSeconds;

        try {
            const response = await createRecipe({
                "name": name,
                "description": description,
                "tags": formattedTags,
                "ingredients": ingredients,
                "calories": calories,
                "prep_time": prepTime,
                "cook_time": cookTime,
                "steps": steps,
                "image": image
            });
            navigate("/"); // Redirect to home page on successful creation
        } catch (err) {
            setError(err.message || "Failed to login"); // Display error message from server
        }
    };


    return (
        <Container component='main' maxWidth='md'>

            <Box sx={{ marginTop: 10, display: 'flex', flexDirection: 'column'}}>
                <Typography variant={'h4'} align={'center'}>
                    New Recipe
                </Typography>
                <Grid container spacing={25} sx={{justifyContent: 'center', paddingTop: '3em'}}>
                    <Grid item xs={12} lg={6}>
                        <Stack spacing={2}>
                            <Typography variant={'h6'}>
                                Name
                            </Typography>
                            <TextField required id={'name'} name={'name'} onChange={(e) => setName(e.target.value)} />


                            <Typography variant={'h6'}>
                                Description
                            </Typography>
                            <TextField multiline id={'description'} name={'description'} rows={6} onChange={(e) => setDescription(e.target.value)}  fullWidth/>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Stack spacing={2}>
                            <Typography variant={'h6'}>
                                Tags
                            </Typography>
                            <Autocomplete
                                multiple
                                id="tags-autocomplete"
                                options={tagSuggestions} // Array of suggested tags
                                freeSolo // Allows the input of arbitrary values not specified in the options
                                value={tags.split(',').filter(tag => tag.trim())} // Convert the comma-separated string to an array
                                onChange={(event, newValue) => {
                                    setTags(newValue.join(',')); // Convert the array back to a comma-separated string
                                }}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip
                                            label={option}
                                            {...getTagProps({ index })}
                                            // Add any additional styling or props to Chip here
                                        />
                                    ))
                                }
                                renderInput={(params) => (
                                    <TextField {...params}/>
                                )}
                            />

                            {/* prep time */}
                            <Typography variant={'h6'}>
                                Prep Time
                            </Typography>
                            <Stack direction={'row'} spacing={1}>
                                <Autocomplete
                                    options={hourOptions}
                                    autoSelect
                                    renderInput={(params) => <TextField {...params} label="H" />}
                                    value={prepTimeHours}
                                    onChange={(event, newValue) => setPrepTimeHours(newValue)}
                                    defaultValue={0}
                                    sx={{width: '100%'}}
                                />

                                <Autocomplete
                                    options={minuteSecondOptions}
                                    autoSelect
                                    renderInput={(params) => <TextField {...params} label="M" />}
                                    value={prepTimeMinutes}
                                    onChange={(event, newValue) => setPrepTimeMinutes(newValue)}
                                    defaultValue={0}
                                    sx={{width: '100%'}}
                                />

                                <Autocomplete
                                    options={minuteSecondOptions}
                                    autoSelect
                                    renderInput={(params) => <TextField {...params} label="S" />}
                                    value={prepTimeSeconds}
                                    onChange={(event, newValue) => setPrepTimeSeconds(newValue)}
                                    defaultValue={0}
                                    sx={{width: '100%'}}
                                />
                            </Stack>

                            {/* cook time*/}
                            <Typography variant={'h6'}>
                                Cook Time
                            </Typography>
                            <Stack direction={'row'} spacing={2}>
                                <Autocomplete
                                    options={hourOptions}
                                    renderInput={(params) => <TextField {...params} label="H" />}
                                    value={cookTimeHours}
                                    onChange={(event, newValue) => setCookTimeHours(newValue)}
                                    defaultValue={0}
                                    sx={{width: '100%'}}
                                />
                                <Autocomplete
                                    options={minuteSecondOptions}
                                    renderInput={(params) => <TextField {...params} label="M" />}
                                    value={cookTimeMinutes}
                                    onChange={(event, newValue) => setCookTimeMinutes(newValue)}
                                    defaultValue={0}
                                    sx={{width: '100%'}}
                                />
                                <Autocomplete
                                    options={minuteSecondOptions}
                                    renderInput={(params) => <TextField {...params} label="S" />}
                                    value={cookTimeSeconds}
                                    onChange={(event, newValue) => setCookTimeSeconds(newValue)}
                                    defaultValue={0}
                                    sx={{width: '100%'}}
                                />
                            </Stack>


                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}

export default CreateRecipe