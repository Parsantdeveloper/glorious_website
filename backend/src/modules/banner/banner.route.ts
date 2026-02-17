
import express from 'express'
import { createBanner, deleteBanner, getBanners, updateBanner } from './banner.controller';
import { requireAuth } from 'middlewares/requiredAuth';
const router = express.Router();

// get banners for users . 

router.get('/', getBanners);


// create banners for admin 

router.post('/', requireAuth, createBanner);

// delete banner for admin

router.delete('/:id', requireAuth, deleteBanner);

// update banner for admin

router.put('/:id', requireAuth, updateBanner);

export default router;