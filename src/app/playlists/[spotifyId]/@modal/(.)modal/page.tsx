import Modal from "@/components/Modal/Modal";
import NewPost from "@/components/NewPost/NewPost";

export default function NewSongModalRoute() {

    return (
        <Modal header="Adicionar música à playlist">
            <NewPost type="playlist" />
        </Modal>
    )

}