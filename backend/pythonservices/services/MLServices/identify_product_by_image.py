from repository.MLRepository.identify_produt import predictImage

def identify_image(image_path):
    """
    Simply passes file path to repository layer
    """
    return predictImage(image_path)