
 import express from 'express';

import { bulkCreateBrands, getBrands } from './brand.controller';
import { get } from 'node:http';

const router = express.Router();

  // bulk create brands for admin only . . 

router.post("/bulk-create",bulkCreateBrands)

// get brands  ( filters must be search by name ,pagination and sorting by name and createdAt )

router.get("/",getBrands)

export default router ;