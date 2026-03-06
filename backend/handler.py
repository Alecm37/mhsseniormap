import sys 
import csv
import os
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__)); #absolute path of handler.py
CSV_DIR = os.path.join(BASE_DIR, "csvs") #safe path to csv container folder, "data"

#<----FUNCTION FOR READING---->
def read_and_process(filename): #takes csv file, and returns JSON output
    try:
        file_path = os.path.join(CSV_DIR, filename) #full path to CSV file

        if not os.path.isfile(file_path): #check if the file exists
            raise FileNotFoundError("CSV not found")
        
        results = [] #hold processed rows

        with open(file_path, mode="r", newline="", encoding="utf-8") as file: #open csv file
            reader = csv.DictReader(file) #csv file where first row are headers
            for row in reader: #append csv file rows
                results.append(row) 
            
        #example:
        # [
        #     { "Name": "Alice", "uni": "UCLA", "year": "2026" },
        #     { "Name": "Bob", "uni": "MIT", "year": "2025" }
        # ]
        #"dictionary" format

        print(json.dumps(results)) #conver python list to a json string
        sys.stdout.flush() #force python to send output

    except Exception as e: #error handling
        sys.stderr.write(str(e))
        sys.exit(1)

#<----FUNCTION FOR WRITING---->
def append_row(filename, row_dict): 
    try:
        file_path = os.path.join(CSV_DIR, filename) #absolute path to csv file

        if not os.path.isfile(file_path):
            raise FileNotFoundError("CSV not found")
        
        #read existing headr if it exists
        fieldnames = None
        if os.path.getsize(file_path) > 0:
            with open(file_path, newline="", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                fieldnames = reader.fieldnames

        #if no header, use keys from row_dict
        if not fieldnames:
            fieldnames = list(row_dict.keys())
        

        with open(file_path, mode="a", newline="", encoding="utf-8") as file: #open file in append mode
            writer = csv.DictWriter(
                file, 
                fieldnames = fieldnames,
                extrasaction = "ignore"
             ) #converts from dictionary 

            if file.tell() == 0: #write header if file is completely empty 
                writer.writeheader()
            
            writer.writerow(row_dict) #appends row

        #Return success as JSON
        print(json.dumps({"status": "ok"}))
        sys.stdout.flush()

    except Exception as e:
        sys.stderr.write(str(e))
        sys.exit(1)

#<----FUNCTION FOR DELETING---->
def delete_rows(filename, criteria):
    try:
        file_path = os.path.join(CSV_DIR, filename)

        if not os.path.isfile(file_path):
            raise FileNotFoundError("CSV not found")
        
        with open(file_path, newline="", encoding="utf-8") as file: #convert each row into a dictionary
            reader = csv.DictReader(file)
            rows = list(reader)
            fieldnames = reader.fieldnames

        filtered_rows = [#check criteria and return an array of elements that do not fulfill criteria
            row for row in rows
            if not all(row.get(k) == str(v) for k, v in criteria.items())
        ]

        with open(file_path, mode="w", newline="", encoding="utf-8") as file:
            writer = csv.DictWriter(file, fieldnames=fieldnames)
            writer.writeheader()  # write header

            # ensure each row has all the header fields
            safe_rows = [
                {k: row.get(k, "") for k in fieldnames}
                for row in filtered_rows
            ]
            writer.writerows(safe_rows)  # write back only filtered_rows

        removed_count = len(rows) - len(filtered_rows)

        # Return JSON so Node can parse it
        print(json.dumps({"status": "ok", "removed": removed_count}))
        sys.stdout.flush()
    
    except Exception as e:
        sys.stderr.write(str(e))
        sys.exit(1)
 
if __name__ == "__main__": #ensures code only runs when python is executed directly
    if len(sys.argv) < 3: #check if filename argument was provided, ["handler.py", "interim.csv"]
        sys.stderr.write("Usage: handler.py <read|append|delete> <filename> [data_json]\n")
        sys.exit(1)
    
    command = sys.argv[1]
    filename = sys.argv[2]

    if command == "read":
        read_and_process(filename)

    elif command == "append":
        if len(sys.argv) < 4:
            sys.stderr.write("No row data provided for append\n")
            sys.exit(1)
        row_json = sys.argv[3]
        row_dict = json.loads(row_json)
        append_row(filename, row_dict)

    elif command == "delete":
        if len(sys.argv) < 4:
            sys.stderr.write("No row data provided for delete\n")
            sys.exit(1)
        criteria_json = sys.argv[3]
        criteria = json.loads(criteria_json)
        delete_rows(filename, criteria)

    else:
        sys.stderr.write(f"Unknown Command: {command}\n")
        sys.exit(1)
