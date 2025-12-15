import socket
import argparse
from PIL import Image
import PIL

parser = argparse.ArgumentParser(
    prog='backend tester',
    description='Client which can send images to the server for testing'
)
parser.add_argument('--port')
parser.add_argument('--server')
parser.add_argument('--image')
args = parser.parse_args()
port = int(args.port)
server_ip, server_port = args.server.split(':')
server_addr = (server_ip, int(server_port))

def send_image():
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.connect(server_addr)
    
    with open(args.image, 'rb') as f:
        image_data = f.read()
        sock.sendall(image_data)

    sock.close()

if __name__ == '__main__':
    send_image()