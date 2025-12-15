import socket
import argparse
from PIL import Image
import PIL
import io

parser = argparse.ArgumentParser(
    prog='Receipt Scan Backend',
    description='Server application for receipt processing'
)
parser.add_argument('--port')
parser.add_argument('--dir')
args = parser.parse_args()
port = int(args.port)

if args.dir[-1] != '\\':
    directory = args.dir + '\\'
else:
    directory = args.dir

if 65535 < port or port <= 1024:
    print("Error: Port out of bounds")
    exit()

hostname = socket.gethostname()
server_ip = socket.gethostbyname(hostname)

def do_server():
    ''' Setup socket, bind on address, wait for TCP connection in server loop '''
    
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        sock.bind((server_ip, port))
    except OSError:
        print("Error: Address already in use")
        sock.close()
        exit()
    sock.listen()
    print(f"Server is listening on {server_ip}:{port} Saving images to directory: {args.dir}")

    image_format = ".png"
    count = 0
    while True:
        try:
            client, client_addr = sock.accept()
        except KeyboardInterrupt:
            sock.close()
            exit()
        print(f"Client connected: {client_addr}")
        count = count + 1
        image_name = directory + 'number' + str(count) + image_format
        image = b''
        while data := client.recv(1024):
            image = image + data

        message = 'RETURN PACKET' # this should be set to the result of OCR processing or whatever info we want to send back
        client.send(message.encode())
        client.close()

        pil_image = Image.open(io.BytesIO(image))
        pil_image.save(image_name) # saves image to stated directory

if __name__ == '__main__':
    do_server()
        