
# Register

### Register with email and email verify




<!-- Using Zod with React Hook Form is a powerful combo for form validation -->
react-hook-form zod @hookform/resolvers

step1 
    import { z } from "zod";
        make schema using Z.object({});

    import { zodResolver } from '@hookform/resolvers/zod';
        using zodResolver(shema) pass it to useForm({resover: ----}) 

    import { useForm } from "react-hook-form"
        useForm have register (use it input), handleSubmit (use at onsubmit and pass a funcaton), formState: { errors } (error show error),    