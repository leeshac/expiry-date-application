import psycopg2
import os

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")

DB_NAME = os.getenv("DB_NAME")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")

def get_connection():
    return psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT,
    )

def add_item_script(clerk_user_id, name, expiry_date, image_url): #passing data
    conn = get_connection() #connect to db
    cur = conn.cursor() #creates a cursor so python can talk to the db

    cur.execute("""
                INSERT INTO items (user_id, name, expiry_date, image) 
                VALUES (%s, %s, %s, %s)
                """, 
                (clerk_user_id, name, expiry_date, image_url))

    #above inserts new row into db, the values are set as %s to safely insert python variables
    conn.commit() #commit changes
    cur.close() #close cursor
    conn.close() #close db connection


def get_item_script(clerk_user_id): #only need clerk if to filter
    conn = get_connection()
    cur = conn.cursor()

    #takes all items with the expected user id
    cur.execute("""
                SELECT id, name, expiry_date, image 
                FROM items 
                WHERE user_id = %s
                """,
                (clerk_user_id,))
    
    rows = cur.fetchall() #get all the rows
    cur.close()
    conn.close()
    return [ {"id": r[0], "name": r[1], "expiry_date": r[2].isoformat(), "image_url": r[3]} for r in rows ]


def del_item_script(id):
    conn = get_connection()
    cur = conn.cursor()

    #deletes the selected item based on the items id
    cur.execute(""" 
                DELETE FROM items
                WHERE id = %s
                """,
                (id,))
    
    conn.commit() #commit changes
    cur.close()
    conn.close()