// const BACKEND_URL = process.env.BACKEND_API_URL!;

import {
  CONTACTS_PAGE_1,
  CONTACTS_PAGE_2,
  CONTACTS_PAGE_3,
  CONTACTS_PAGE_4,
} from 'modules/conversation/shared/utils/contact-list';
import { NextResponse } from 'next/server';

export async function GET(req: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get('page') ?? '1');
    const pageSize = Number(searchParams.get('page_size') ?? '5');
    const ordering = searchParams.get('ordering');

    console.log('ordering:', ordering);
    console.log('page_size:', pageSize);

    let response;

    switch (page) {
      case 1:
        response = CONTACTS_PAGE_1;
        break;
      case 2:
        response = CONTACTS_PAGE_2;
        break;
      case 3:
        response = CONTACTS_PAGE_3;
        break;
      case 4:
        response = CONTACTS_PAGE_4;
        break;
      default:
        response = {
          count: 20,
          next: null,
          previous: null,
          results: [],
        };
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('GET /messenger-list error:', error);

    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
